import React, { useState } from 'react';
import {
  Gavel,
  Mic,
  Target,
  Brain,
  ChevronRight,
  ArrowRight,
  Star,
  Zap,
  Shield,
  Users,
  Trophy,
  CheckCircle,
  BarChart3,
  BookOpen,
  Play,
} from 'lucide-react';

const LandingPage = ({ onGetStarted, onContinueAsGuest }) => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const githubRepoUrl = 'https://github.com/Danthemainman1/adjucator-ai-oths';
  const githubReadmeUrl = 'https://github.com/Danthemainman1/adjucator-ai-oths/blob/main/README.md';
  const githubIssuesUrl = 'https://github.com/Danthemainman1/adjucator-ai-oths/issues';

  const handleFooterLink = (link) => {
    const actions = {
      'Speech Analysis': onGetStarted,
      'Strategy Generator': onGetStarted,
      'Live Coaching': onGetStarted,
      'Team Analytics': onGetStarted,
      'Documentation': () => window.open(githubReadmeUrl, '_blank', 'noopener,noreferrer'),
      'Debate Guides': () => window.open(githubReadmeUrl, '_blank', 'noopener,noreferrer'),
      'Event Rubrics': () => window.open(githubRepoUrl, '_blank', 'noopener,noreferrer'),
      'API Access': () => window.open(githubIssuesUrl, '_blank', 'noopener,noreferrer'),
      'About Us': () => window.open(githubRepoUrl, '_blank', 'noopener,noreferrer'),
      'Contact': () => window.open(githubIssuesUrl, '_blank', 'noopener,noreferrer'),
      'Privacy Policy': () => window.open(githubReadmeUrl, '_blank', 'noopener,noreferrer'),
      'Terms of Service': () => window.open(githubReadmeUrl, '_blank', 'noopener,noreferrer'),
    };

    const action = actions[link];
    if (action) {
      action();
    }
  };

  const features = [
    {
      icon: Zap,
      title: 'Real-time Analysis',
      description: 'Get instant AI feedback on speeches with event-specific rubrics. Identify strengths, weaknesses, and actionable improvements in seconds.',
      color: 'bg-teal-DEFAULT',
      accent: '#0f4c5c',
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Manage your entire debate squad in one place. Share strategies, track individual progress, and coordinate team preparation.',
      color: 'bg-emerald-DEFAULT',
      accent: '#10451d',
    },
    {
      icon: BarChart3,
      title: 'Performance Insights',
      description: 'Deep analytics on speaking patterns, argument effectiveness, and improvement trends. Data-driven coaching for measurable results.',
      color: 'bg-gold-DEFAULT',
      accent: '#d4af37',
    },
    {
      icon: Trophy,
      title: 'Tournament Tracking',
      description: 'Log competition results, monitor rankings, and analyze performance across events. See what strategies win at the highest levels.',
      color: 'bg-teal-light',
      accent: '#0f4c5c',
    },
  ];

  const testimonials = [
    {
      quote: "The strategy generator helped me anticipate every argument my opponents made at State.",
      author: "Marcus T.",
      role: "Lincoln-Douglas Champion",
      avatar: "👨‍🎓",
    },
    {
      quote: "This completely transformed how I prepare for tournaments. My speaker points jumped 2 points!",
      author: "Sarah M.",
      role: "Public Forum Debater",
      avatar: "👩‍🎓",
    },
    {
      quote: "Our whole team uses it. The analytics show us exactly where we need to improve week over week.",
      author: "Coach Rivera",
      role: "State Championship Coach",
      avatar: "🏆",
    },
  ];

  const benefits = [
    'Instant AI feedback in seconds',
    'Event-specific evaluation rubrics',
    'Track progress over time',
    'Personalized improvement drills',
  ];

  const stats = [
    { value: '10,000+', label: 'Active Debaters', icon: Users },
    { value: '500+', label: 'Teams & Schools', icon: Trophy },
    { value: '1M+', label: 'Speeches Analyzed', icon: Mic },
  ];

  return (
    <div style={{ background: '#0a1628', minHeight: '100vh', color: '#ffffff', fontFamily: 'Inter, Arial, sans-serif' }}>

      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, borderBottom: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', background: 'rgba(10,22,40,0.85)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #0f4c5c, #22d3ee)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Gavel size={18} color="#fff" />
            </div>
            <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: '-0.3px' }}>Adjudicator AI</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={onGetStarted}
              style={{ padding: '8px 20px', borderRadius: 8, background: 'linear-gradient(135deg, #0f4c5c, #22d3ee)', color: '#fff', fontWeight: 600, fontSize: 14, border: 'none', cursor: 'pointer' }}
            >
              Try Free
            </button>
            <button
              onClick={onGetStarted}
              style={{ padding: '8px 20px', borderRadius: 8, background: 'transparent', color: '#cbd5e1', fontWeight: 500, fontSize: 14, border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              Sign In <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ paddingTop: 140, paddingBottom: 100, paddingLeft: 24, paddingRight: 24, position: 'relative', overflow: 'hidden' }}>
        {/* BG decorations */}
        <div style={{ position: 'absolute', top: -80, right: -80, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(15,76,92,0.35) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 0, left: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 100, border: '1px solid rgba(34,211,238,0.3)', background: 'rgba(34,211,238,0.08)', marginBottom: 32, fontSize: 13, color: '#22d3ee', fontWeight: 500 }}>
            <Star size={12} fill="#22d3ee" />
            Trusted by 500+ Competitive Teams
          </div>

          <h1 style={{ fontSize: 'clamp(40px, 7vw, 80px)', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-2px', marginBottom: 24 }}>
            <span style={{ color: '#ffffff' }}>AI-Powered</span>
            <br />
            <span style={{ background: 'linear-gradient(135deg, #22d3ee, #0f4c5c 60%, #d4af37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Debate Coaching</span>
            <br />
            <span style={{ color: '#ffffff' }}>for Competitive Teams</span>
          </h1>

          <p style={{ fontSize: 18, lineHeight: 1.7, color: '#94a3b8', maxWidth: 600, margin: '0 auto 40px', fontWeight: 400 }}>
            Elite debate programs use Adjudicator AI to analyze speeches in real-time, track team performance, and gain competitive insights that win tournaments.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 72 }}>
            <button
              onClick={onGetStarted}
              style={{ padding: '16px 36px', borderRadius: 12, background: 'linear-gradient(135deg, #0f4c5c, #22d3ee)', color: '#fff', fontWeight: 700, fontSize: 16, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 32px rgba(34,211,238,0.25)', transition: 'transform 0.2s' }}
              onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Start Free Trial <ChevronRight size={18} />
            </button>
            <button
              style={{ padding: '16px 36px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', color: '#fff', fontWeight: 600, fontSize: 16, border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, backdropFilter: 'blur(8px)' }}
            >
              <Play size={16} fill="white" /> Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap' }}>
            {stats.map((stat, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(15,76,92,0.5)', border: '1px solid rgba(34,211,238,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <stat.icon size={20} color="#22d3ee" />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#ffffff', lineHeight: 1.1 }}>{stat.value}</div>
                  <div style={{ fontSize: 12, color: '#64748b', fontWeight: 500, marginTop: 2 }}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '100px 24px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{ fontSize: 40, fontWeight: 800, color: '#ffffff', marginBottom: 16, letterSpacing: '-1px' }}>Everything You Need to Excel</h2>
            <p style={{ fontSize: 17, color: '#64748b', maxWidth: 500, margin: '0 auto' }}>From speech analysis to strategy building, we've got every aspect of your debate prep covered.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {features.map((f, i) => (
              <div key={i} style={{ padding: 32, borderRadius: 20, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', transition: 'border-color 0.2s, background 0.2s', cursor: 'default' }}
                onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(34,211,238,0.3)'; e.currentTarget.style.background = 'rgba(34,211,238,0.04)'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 14, background: `rgba(15,76,92,0.5)`, border: '1px solid rgba(34,211,238,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <f.icon size={22} color="#22d3ee" />
                </div>
                <h3 style={{ fontSize: 19, fontWeight: 700, color: '#f1f5f9', marginBottom: 10 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7 }}>{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: 40, fontWeight: 800, color: '#ffffff', marginBottom: 16, letterSpacing: '-1px', lineHeight: 1.15 }}>Why Debaters Choose Us</h2>
            <p style={{ fontSize: 16, color: '#64748b', marginBottom: 36, lineHeight: 1.7 }}>We built this for debaters, by debaters. Every feature is designed to give you a competitive edge.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {benefits.map((b, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(34,211,238,0.15)', border: '1px solid rgba(34,211,238,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <CheckCircle size={13} color="#22d3ee" />
                  </div>
                  <span style={{ color: '#cbd5e1', fontSize: 15, fontWeight: 500 }}>{b}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial card */}
          <div style={{ position: 'relative' }}>
            <div style={{ padding: 36, borderRadius: 24, background: 'linear-gradient(135deg, rgba(15,76,92,0.4), rgba(10,22,40,0.8))', border: '1px solid rgba(34,211,238,0.2)', backdropFilter: 'blur(12px)' }}>
              <div style={{ fontSize: 48, marginBottom: 4, color: '#d4af37' }}>"</div>
              <p style={{ fontSize: 17, color: '#e2e8f0', lineHeight: 1.7, fontStyle: 'italic', marginBottom: 28 }}>
                {testimonials[currentTestimonial].quote}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(15,76,92,0.6)', border: '1px solid rgba(34,211,238,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                  {testimonials[currentTestimonial].avatar}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: '#ffffff', fontSize: 15 }}>{testimonials[currentTestimonial].author}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{testimonials[currentTestimonial].role}</div>
                </div>
              </div>
            </div>
            {/* Dots */}
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 20 }}>
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setCurrentTestimonial(i)}
                  style={{ width: i === currentTestimonial ? 24 : 8, height: 8, borderRadius: 4, background: i === currentTestimonial ? '#22d3ee' : 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ padding: '64px 48px', borderRadius: 28, background: 'linear-gradient(135deg, #0f4c5c 0%, #0a1628 50%, #0f4c5c 100%)', border: '1px solid rgba(34,211,238,0.25)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -60, right: -60, width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <Trophy size={40} color="#d4af37" style={{ marginBottom: 20 }} />
            <h2 style={{ fontSize: 36, fontWeight: 800, color: '#ffffff', marginBottom: 16, letterSpacing: '-0.5px' }}>Ready to Win Your Next Round?</h2>
            <p style={{ fontSize: 16, color: '#94a3b8', marginBottom: 36, lineHeight: 1.6 }}>Join thousands of debaters already using AI to sharpen their skills and dominate competitions.</p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={onGetStarted}
                style={{ padding: '14px 32px', borderRadius: 12, background: 'linear-gradient(135deg, #22d3ee, #0f4c5c)', color: '#fff', fontWeight: 700, fontSize: 16, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 20px rgba(34,211,238,0.3)' }}
              >
                Start Free Today <ChevronRight size={18} />
              </button>
              <button
                onClick={onContinueAsGuest}
                style={{ padding: '14px 32px', borderRadius: 12, background: 'transparent', color: '#cbd5e1', fontWeight: 600, fontSize: 16, border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer' }}
              >
                Continue as Guest
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '60px 24px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, marginBottom: 48 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #0f4c5c, #22d3ee)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Gavel size={14} color="#fff" />
                </div>
                <span style={{ fontWeight: 700, fontSize: 16, color: '#fff' }}>Adjudicator AI</span>
              </div>
              <p style={{ color: '#475569', fontSize: 14, lineHeight: 1.7, maxWidth: 240 }}>AI-powered debate coaching platform for competitive teams and speech programs.</p>
              <div style={{ display: 'flex', gap: 4, marginTop: 16 }}>
                {[1,2,3,4,5].map(n => <Star key={n} size={14} fill="#d4af37" color="#d4af37" />)}
                <span style={{ color: '#64748b', fontSize: 13, marginLeft: 6 }}>4.9/5</span>
              </div>
            </div>
            {[
              { title: 'Product', links: ['Speech Analysis', 'Strategy Generator', 'Live Coaching', 'Team Analytics'] },
              { title: 'Resources', links: ['Documentation', 'Debate Guides', 'Event Rubrics', 'API Access'] },
              { title: 'Company', links: ['About Us', 'Contact', 'Privacy Policy', 'Terms of Service'] },
            ].map((col, i) => (
              <div key={i}>
                <h4 style={{ fontWeight: 700, fontSize: 14, color: '#fff', marginBottom: 16, letterSpacing: '0.5px', textTransform: 'uppercase' }}>{col.title}</h4>
                {col.links.map(link => (
                  <div key={link} style={{ marginBottom: 10 }}>
                    <button
                      type="button"
                      onClick={() => handleFooterLink(link)}
                      style={{ color: '#475569', fontSize: 14, textDecoration: 'none', transition: 'color 0.15s', background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
                      onMouseOver={e => e.currentTarget.style.color = '#22d3ee'}
                      onMouseOut={e => e.currentTarget.style.color = '#475569'}
                    >{link}</button>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <span style={{ color: '#334155', fontSize: 14 }}>© 2025 Adjudicator AI. All rights reserved.</span>
            <span style={{ color: '#334155', fontSize: 14 }}>Built for debaters, by debaters.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
