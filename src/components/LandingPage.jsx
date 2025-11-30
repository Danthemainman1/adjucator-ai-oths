import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gavel,
  Mic,
  Target,
  Brain,
  Sparkles,
  ChevronRight,
  ArrowRight,
  Star,
  Zap,
  Shield,
  Users,
  Trophy,
  Play,
  CheckCircle,
  MessageSquare,
  BarChart3,
  BookOpen
} from 'lucide-react';

const LandingPage = ({ onGetStarted, onContinueAsGuest }) => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const features = [
    {
      icon: Gavel,
      title: 'AI Speech Judge',
      description: 'Get expert-level feedback on your speeches with event-specific rubrics for debate, oratory, and interpretation.',
      color: 'from-cyan-500 to-blue-500',
      delay: 0.1
    },
    {
      icon: Target,
      title: 'Strategy Generator',
      description: 'Build winning arguments, anticipate rebuttals, and prepare devastating cross-examination strategies.',
      color: 'from-purple-500 to-pink-500',
      delay: 0.2
    },
    {
      icon: Mic,
      title: 'Live Coaching',
      description: 'Real-time feedback during practice rounds with instant suggestions for improvement.',
      color: 'from-orange-500 to-red-500',
      delay: 0.3
    },
    {
      icon: Brain,
      title: 'Tone Analysis',
      description: 'Understand your rhetorical impact with confidence scoring, emotional tone detection, and ethos/pathos/logos analysis.',
      color: 'from-green-500 to-emerald-500',
      delay: 0.4
    }
  ];

  const benefits = [
    { icon: Zap, text: 'Instant AI feedback in seconds' },
    { icon: Shield, text: 'Event-specific evaluation rubrics' },
    { icon: BarChart3, text: 'Track progress over time' },
    { icon: BookOpen, text: 'Personalized improvement drills' }
  ];

  const testimonials = [
    {
      quote: "This completely transformed how I prepare for tournaments. My speaker points jumped 2 points!",
      author: "Sarah M.",
      role: "Public Forum Debater",
      avatar: "👩‍🎓"
    },
    {
      quote: "The strategy generator helped me anticipate every argument my opponents made at State.",
      author: "Marcus T.",
      role: "Lincoln-Douglas Champion",
      avatar: "👨‍🎓"
    },
    {
      quote: "Finally, feedback that understands the difference between Informative and Extemp. Game changer.",
      author: "Emily R.",
      role: "Speech Coach",
      avatar: "👩‍🏫"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary/20 via-transparent to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-accent/20 via-transparent to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-full blur-3xl animate-float" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/25">
              <Gavel className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Adjudicator AI</span>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <button
              onClick={onContinueAsGuest}
              className="text-text-secondary hover:text-white transition-colors px-4 py-2"
            >
              Try Free
            </button>
            <button
              onClick={onGetStarted}
              className="btn-primary flex items-center gap-2"
            >
              Sign In
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 pt-16 pb-24">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">AI-Powered Debate Coaching</span>
            </motion.div>

            {/* Headline */}
            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            >
              <span className="text-white">Win More </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-cyan-400 to-accent">
                Debates
              </span>
              <br />
              <span className="text-white">With AI Coaching</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p 
              variants={itemVariants}
              className="text-xl text-text-secondary mb-10 max-w-2xl mx-auto"
            >
              Get instant, expert-level feedback on your speeches. Build winning strategies. 
              Analyze your rhetorical impact. All powered by advanced AI.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <button
                onClick={onGetStarted}
                className="group relative px-8 py-4 bg-gradient-to-r from-primary to-cyan-400 rounded-xl font-semibold text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all hover:scale-105"
              >
                <span className="flex items-center gap-2">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              <button
                onClick={onContinueAsGuest}
                className="group px-8 py-4 rounded-xl font-semibold text-text-secondary hover:text-white border border-slate-700 hover:border-slate-600 hover:bg-slate-800/50 transition-all flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                Try Demo
              </button>
            </motion.div>

            {/* Social Proof */}
            <motion.div variants={itemVariants} className="flex items-center justify-center gap-8 text-text-muted">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {['👩‍🎓', '👨‍🎓', '👩‍💼', '👨‍💼'].map((emoji, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-slate-800 border-2 border-bg-primary flex items-center justify-center text-sm">
                      {emoji}
                    </div>
                  ))}
                </div>
                <span className="text-sm">1,000+ debaters</span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                ))}
                <span className="text-sm ml-1">4.9/5 rating</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-24 bg-gradient-to-b from-transparent via-slate-900/50 to-transparent">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything You Need to Excel
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              From speech analysis to strategy building, we've got every aspect of your debate prep covered.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: feature.delay }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group relative"
              >
                <div className="glass-card h-full cursor-pointer">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-text-secondary text-sm">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative z-10 px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Why Debaters Choose Us
              </h2>
              <p className="text-text-secondary mb-8">
                We built this for debaters, by debaters. Every feature is designed to give you a competitive edge.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-primary/30 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <benefit.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-text-primary font-medium">{benefit.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Testimonials Carousel */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="glass-card relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl" />
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTestimonial}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="relative z-10"
                  >
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                      ))}
                    </div>
                    
                    <blockquote className="text-xl text-white font-medium mb-6 leading-relaxed">
                      "{testimonials[currentTestimonial].quote}"
                    </blockquote>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-2xl">
                        {testimonials[currentTestimonial].avatar}
                      </div>
                      <div>
                        <div className="text-white font-semibold">
                          {testimonials[currentTestimonial].author}
                        </div>
                        <div className="text-text-muted text-sm">
                          {testimonials[currentTestimonial].role}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Dots */}
                <div className="flex items-center gap-2 mt-6">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentTestimonial
                          ? 'w-6 bg-primary'
                          : 'bg-slate-700 hover:bg-slate-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative rounded-3xl overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20" />
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl" />
            
            <div className="relative z-10 p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent mb-6 shadow-lg shadow-primary/25">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Win Your Next Round?
              </h2>
              <p className="text-text-secondary mb-8 max-w-lg mx-auto">
                Join thousands of debaters already using AI to sharpen their skills and dominate competitions.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={onGetStarted}
                  className="group px-8 py-4 bg-white text-slate-900 rounded-xl font-semibold hover:bg-gray-100 transition-all hover:scale-105 flex items-center gap-2"
                >
                  Start Free Today
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={onContinueAsGuest}
                  className="px-8 py-4 text-white font-semibold hover:underline underline-offset-4"
                >
                  Continue as Guest
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-text-muted text-sm">
            <Gavel className="w-4 h-4" />
            <span>© 2025 Adjudicator AI. Built for debaters.</span>
          </div>
          <div className="flex items-center gap-6 text-text-muted text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
