import { clsx } from 'clsx'

// Combine class names with clsx
export function cn(...inputs) {
  return clsx(inputs)
}

// Format time from seconds to MM:SS
export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// Format date for display
export function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

// Format relative time (e.g., "2 hours ago")
export function formatRelativeTime(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return formatDate(dateString)
}

// Alias for formatRelativeTime
export const getTimeAgo = formatRelativeTime

// Truncate text with ellipsis
export function truncate(text, maxLength) {
  if (!text || text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

// Generate unique ID
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Debounce function
export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Throttle function
export function throttle(func, limit) {
  let inThrottle
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Convert file to base64
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const base64 = reader.result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = error => reject(error)
  })
}

// Convert blob to base64
export function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(blob)
    reader.onload = () => {
      const base64 = reader.result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = error => reject(error)
  })
}

// Calculate average from array of numbers
export function average(arr) {
  if (!arr || arr.length === 0) return 0
  return arr.reduce((a, b) => a + b, 0) / arr.length
}

// Get score color based on value
export function getScoreColor(score, max = 100) {
  const percentage = (score / max) * 100
  if (percentage >= 80) return 'text-emerald-400'
  if (percentage >= 60) return 'text-cyan-400'
  if (percentage >= 40) return 'text-amber-400'
  return 'text-red-400'
}

// Get score background color
export function getScoreBgColor(score, max = 100) {
  const percentage = (score / max) * 100
  if (percentage >= 80) return 'bg-emerald-500/10 border-emerald-500/20'
  if (percentage >= 60) return 'bg-cyan-500/10 border-cyan-500/20'
  if (percentage >= 40) return 'bg-amber-500/10 border-amber-500/20'
  return 'bg-red-500/10 border-red-500/20'
}

// Storage helpers
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
      console.error('Storage error:', e)
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key)
    } catch (e) {
      console.error('Storage error:', e)
    }
  }
}

// Copy to clipboard
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement('textarea')
    textarea.value = text
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    return true
  }
}

// Download content as file
export function downloadFile(content, filename, type = 'text/plain') {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Check if device supports touch
export function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

// Check if device is mobile
export function isMobile() {
  return window.innerWidth < 768
}

// Filler words to detect
export const FILLER_WORDS = [
  'um', 'uh', 'like', 'you know', 'basically', 'actually', 
  'literally', 'right', 'so', 'well', 'I mean', 'kind of', 
  'sort of', 'stuff', 'things', 'whatever'
]

// Check for offensive words in username
export const RESTRICTED_WORDS = [
  'admin', 'root', 'system', 'support', 'moderator', 'staff'
]

export function isValidUsername(username) {
  if (!username || username.length < 3 || username.length > 20) return false
  if (!/^[a-zA-Z0-9_]+$/.test(username)) return false
  const lower = username.toLowerCase()
  return !RESTRICTED_WORDS.some(word => lower.includes(word))
}
