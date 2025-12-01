import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  auth,
  onAuthChange,
  signIn,
  signUp,
  signInWithGoogle,
  logOut,
  createUserProfile,
  getUserProfile,
  updateUserProfile
} from '../utils/firebase';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [needsAvatarSelection, setNeedsAvatarSelection] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          // Fetch or create user profile
          let profile = await getUserProfile(firebaseUser.uid);
          
          if (!profile) {
            // Create new profile for first-time users
            profile = {
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || '',
              username: firebaseUser.displayName?.toLowerCase().replace(/\s+/g, '_') || firebaseUser.email.split('@')[0],
              photoURL: firebaseUser.photoURL || '',
              avatarId: null, // New field for custom avatar
              preferredEvents: [],
              settings: {
                theme: 'dark',
                autoSaveHistory: true
              },
              createdAt: new Date().toISOString()
            };
            await createUserProfile(firebaseUser.uid, profile);
            // New users need to select an avatar
            setNeedsAvatarSelection(true);
          } else {
            // Check if existing user needs avatar selection
            // Show prompt if no custom avatar is set (regardless of Google photoURL)
            const hasCustomAvatar = profile.avatarId && profile.avatarId !== null && profile.avatarId !== '';
            if (!hasCustomAvatar) {
              setNeedsAvatarSelection(true);
            }
          }
          
          setUserProfile(profile);
        } catch (err) {
          console.error('Error fetching user profile:', err);
        }
      } else {
        setUserProfile(null);
        setNeedsAvatarSelection(false);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const result = await signIn(email, password);
      return result;
    } catch (err) {
      setError(getErrorMessage(err.code));
      throw err;
    }
  };

  const register = async (email, password, displayName) => {
    setError(null);
    try {
      const result = await signUp(email, password);
      
      // Create user profile
      await createUserProfile(result.user.uid, {
        email,
        displayName,
        username: displayName?.toLowerCase().replace(/\s+/g, '_') || email.split('@')[0],
        photoURL: '',
        avatarId: null,
        preferredEvents: [],
        settings: {
          theme: 'dark',
          autoSaveHistory: true
        },
        createdAt: new Date().toISOString()
      });
      
      // New registration needs avatar selection
      setNeedsAvatarSelection(true);
      
      return result;
    } catch (err) {
      setError(getErrorMessage(err.code));
      throw err;
    }
  };

  const loginWithGoogle = async () => {
    setError(null);
    try {
      const result = await signInWithGoogle();
      
      // Check if profile exists, create if not
      let profile = await getUserProfile(result.user.uid);
      
      if (!profile) {
        await createUserProfile(result.user.uid, {
          email: result.user.email,
          displayName: result.user.displayName || '',
          username: result.user.displayName?.toLowerCase().replace(/\s+/g, '_') || result.user.email.split('@')[0],
          photoURL: result.user.photoURL || '',
          avatarId: null,
          preferredEvents: [],
          settings: {
            theme: 'dark',
            autoSaveHistory: true
          },
          createdAt: new Date().toISOString()
        });
        // New Google users need avatar selection too
        setNeedsAvatarSelection(true);
      } else if (!profile.avatarId && !profile.photoURL) {
        setNeedsAvatarSelection(true);
      }
      
      return result;
    } catch (err) {
      setError(getErrorMessage(err.code));
      throw err;
    }
  };

  const logout = async () => {
    setError(null);
    try {
      await logOut();
    } catch (err) {
      setError(getErrorMessage(err.code));
      throw err;
    }
  };

  const updateProfile = async (updates) => {
    if (!user) return;
    
    try {
      await updateUserProfile(user.uid, updates);
      setUserProfile(prev => ({ ...prev, ...updates }));
    } catch (err) {
      setError('Failed to update profile');
      throw err;
    }
  };

  const setAvatar = async (avatar) => {
    if (!user) return;
    
    try {
      const updates = { avatarId: avatar?.id || null };
      await updateUserProfile(user.uid, updates);
      setUserProfile(prev => ({ ...prev, ...updates }));
      setNeedsAvatarSelection(false);
    } catch (err) {
      setError('Failed to update avatar');
      throw err;
    }
  };

  const skipAvatarSelection = () => {
    setNeedsAvatarSelection(false);
  };

  const clearError = () => setError(null);

  const value = {
    user,
    userProfile,
    loading,
    error,
    login,
    register,
    loginWithGoogle,
    logout,
    updateProfile,
    setAvatar,
    clearError,
    isAuthenticated: !!user,
    needsAvatarSelection,
    skipAvatarSelection
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Helper to convert Firebase error codes to user-friendly messages
function getErrorMessage(code) {
  const messages = {
    'auth/email-already-in-use': 'This email is already registered. Try logging in instead.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/operation-not-allowed': 'This sign-in method is not enabled.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-credential': 'Invalid credentials. Please check your email and password.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
    'auth/popup-closed-by-user': 'Sign-in popup was closed. Please try again.',
    'auth/popup-blocked': 'Sign-in popup was blocked. Please enable popups.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
  };
  
  return messages[code] || 'An error occurred. Please try again.';
}

export default AuthContext;
