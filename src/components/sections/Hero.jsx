import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiArrowRight, FiShoppingBag } from 'react-icons/fi'

// ─── Cycling words for the typewriter span ───────────────────────────────────
const cyclingWords = [
  'Instant Upgrade',
  'Real Value',
  'New Possibilities',
  'Campus-Ready Gear',
  'Your Next Level',
]

// ─── Particle component (ported from File A) ─────────────────────────────────
function Particles() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    for (let i = 0; i < 22; i++) {
      const p = document.createElement('div')
      const size = Math.random() * 3 + 1
      const x = Math.random() * 100
      const dur = Math.random() * 15 + 10
      const delay = Math.random() * 15
      const gold = Math.random() > 0.5
      p.style.cssText = `
        position:absolute; border-radius:50%;
        width:${size}px; height:${size}px;
        left:${x}%;
        background:${gold ? 'rgba(245,197,24,0.6)' : 'rgba(255,107,43,0.4)'};
        animation: particleFloat ${dur}s ${delay}s linear infinite;
        box-shadow:0 0 ${size * 2}px ${gold ? 'rgba(245,197,24,0.5)' : 'rgba(255,107,43,0.4)'};
        pointer-events:none;
      `
      container.appendChild(p)
    }
    return () => { container.innerHTML = '' }
  }, [])

  return <div ref={containerRef} className="absolute inset-0 z-[2] pointer-events-none" />
}

// ─── Orbit (animated circle + cards, ported from File A) ─────────────────────
function OrbitVisual() {
  const orbitCards = [
    { icon: '✦', label: 'Genuine Gear' },
    { icon: '🔒', label: 'Secure Trade-In' },
    { icon: '🚀', label: 'Campus Delivery' },
    { icon: '⚡', label: 'Instant Valuation' },
  ]

  // Each card sits at top / right / bottom / left of the orbit ring
  const positions = [
    'top-[-18px] left-1/2 -translate-x-1/2',
    'right-[-28px] top-1/2 -translate-y-1/2',
    'bottom-[-18px] left-1/2 -translate-x-1/2',
    'left-[-28px] top-1/2 -translate-y-1/2',
  ]
  // counter-rotate so the label text stays readable
  const counterAnims = [
    'animate-cardCounter1',
    'animate-cardCounter2',
    'animate-cardCounter3',
    'animate-cardCounter4',
  ]

  return (
    <div className="relative w-[320px] h-[320px] md:w-[380px] md:h-[380px] flex-shrink-0">
      {/* Glow */}
      <div className="absolute inset-[-60px] rounded-full animate-glowPulse"
        style={{ background: 'radial-gradient(circle, rgba(245,197,24,0.12) 0%, transparent 70%)' }} />

      {/* Outer orbit ring */}
      <div className="absolute inset-[-10px] rounded-full border border-yellow/20 animate-spinSlow orbitRingDot" />
      {/* Inner ring (counter spin) */}
      <div className="absolute inset-[30px] rounded-full border border-orange-400/10 animate-spinSlowRev" />

      {/* Center brand circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10
        w-[130px] h-[130px] rounded-full flex flex-col items-center justify-center text-center
        border border-yellow/30"
        style={{
          background: 'linear-gradient(135deg, rgba(245,197,24,0.15), rgba(255,107,43,0.1))',
          boxShadow: '0 0 40px rgba(245,197,24,0.15), inset 0 0 30px rgba(245,197,24,0.05)',
        }}
      >
        <span className="text-3xl leading-none mb-1">⚡</span>
        <span className="font-bricolage font-black text-xs text-yellow tracking-wide">novaXchange</span>
        <span className="text-[9px] text-gray uppercase tracking-widest mt-0.5">Upgrade Culture</span>
      </div>

      {/* Rotating cards wrapper */}
      <div className="absolute inset-0 animate-spinSlowCards">
        {orbitCards.map((card, idx) => (
          <div
            key={idx}
            className={`absolute ${positions[idx]} ${counterAnims[idx]}
              bg-ink/90 border border-yellow/20 rounded-[10px] px-3 py-1.5
              flex items-center gap-1.5 whitespace-nowrap text-[11px] font-bold
              font-bricolage text-white backdrop-blur-sm
              shadow-[0_4px_20px_rgba(0,0,0,0.4)]`}
          >
            <span className="text-xs">{card.icon}</span>
            {card.label}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Typewriter / word-cycling span ──────────────────────────────────────────
function CyclingWord() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % cyclingWords.length)
    }, 2200)
    return () => clearInterval(interval)
  }, [])

  return (
    <span className="inline-block relative min-w-[240px] sm:min-w-[320px]">
      <AnimatePresence mode="wait">
        <motion.span
          key={cyclingWords[index]}
          className="block bg-gradient-to-r from-yellow to-yellow-deep bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -16, filter: 'blur(4px)' }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          {cyclingWords[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
const Hero = () => {
  return (
    <>
      {/* Keyframe styles injected once */}
      <style>{`
        @keyframes particleFloat {
          0%   { transform: translateY(100vh) translateX(0);  opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(-10vh) translateX(40px); opacity: 0; }
        }
        @keyframes spinSlow    { from { transform: rotate(0deg);    } to { transform: rotate(360deg);  } }
        @keyframes spinSlowRev { from { transform: rotate(0deg);    } to { transform: rotate(-360deg); } }
        @keyframes spinSlowCards { from { transform: rotate(0deg); } to { transform: rotate(360deg);  } }
        @keyframes glowPulse {
          0%, 100% { transform: scale(1);   opacity: 0.8; }
          50%      { transform: scale(1.1); opacity: 1;   }
        }
        @keyframes gridDrift {
          0%   { background-position: 0 0;     }
          100% { background-position: 60px 60px; }
        }
        /* keep each label readable while orbit spins */
        @keyframes cardCounter1 { from { transform: translateX(-50%) rotate(0deg);   } to { transform: translateX(-50%) rotate(-360deg);  } }
        @keyframes cardCounter2 { from { transform: translateY(-50%) rotate(0deg);   } to { transform: translateY(-50%) rotate(-360deg);  } }
        @keyframes cardCounter3 { from { transform: translateX(-50%) rotate(0deg);   } to { transform: translateX(-50%) rotate(-360deg);  } }
        @keyframes cardCounter4 { from { transform: translateY(-50%) rotate(0deg);   } to { transform: translateY(-50%) rotate(-360deg);  } }
        .animate-spinSlow        { animation: spinSlow 22s linear infinite; }
        .animate-spinSlowRev     { animation: spinSlowRev 16s linear infinite; }
        .animate-spinSlowCards   { animation: spinSlow 14s linear infinite; }
        .animate-glowPulse       { animation: glowPulse 3s ease infinite; }
        .animate-cardCounter1    { animation: cardCounter1 14s linear infinite; }
        .animate-cardCounter2    { animation: cardCounter2 14s linear infinite; }
        .animate-cardCounter3    { animation: cardCounter3 14s linear infinite; }
        .animate-cardCounter4    { animation: cardCounter4 14s linear infinite; }
        
        /* spinning dot on outer ring */
        .orbitRingDot::before {
          content: '';
          position: absolute; top: -2px; left: 50%;
          transform: translateX(-50%);
          width: 4px; height: 4px; border-radius: 50%;
          background: #FFE033;
          box-shadow: 0 0 8px #FFE033;
        }

        /* animated background grid */
        .hero-grid-bg {
          background-image:
          linear-gradient(rgba(245,197,24,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(245,197,24,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
          animation: gridDrift 20s linear infinite;
        }
      `}</style>

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* ── Background ── */}
        <div className="absolute inset-0 z-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 60% at 50% 40%, rgba(108,43,217,0.18) 0%, transparent 70%),
              radial-gradient(ellipse 60% 50% at 20% 80%, rgba(255,60,172,0.10) 0%, transparent 60%),
              #0E0A1A
            `,
          }}
        />
        {/* animated grid overlay */}
        <div className="absolute inset-0 z-[1] hero-grid-bg" />
        {/* particles */}
        <Particles />

        {/* ── Content: text LEFT — orbit RIGHT (horizontal) ── */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16
          flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">

          {/* LEFT: text block */}
          <motion.div
            className="flex-1 text-center lg:text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6
              border border-yellow/25"
              style={{ background: 'rgba(245,197,24,0.1)' }}>
              <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_#00E5A0] animate-pulse" />
              <span className="text-yellow text-xs font-semibold uppercase tracking-widest">
                For Students & Young Professionals in Uganda
              </span>
            </div>

            {/* Headline with cycling word */}
            <h1 className="font-bricolage text-4xl sm:text-5xl md:text-6xl font-extrabold
              leading-[1.05] tracking-tight text-white mb-6">
              Turn Your Device Into
              <br />
              <CyclingWord />
            </h1>

            <p className="max-w-lg text-white/60 text-lg font-light leading-relaxed mb-8
              mx-auto lg:mx-0">
              novaXchange helps students and young professionals 
              trade in old devices, upgrade affordably, access genuine accessories, 
              and build better digital workspaces.                                                                     
              No fake products. No complicated process. Just smart upgrades.
            </p>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <a href="#lead-capture" className="btn-primary">
                Upgrade today <FiArrowRight />
              </a>
              <a href="#solutions"
                className="btn-secondary bg-transparent text-white border-white/20 shadow-none hover:bg-white/10">
                Explore Services <FiShoppingBag />
              </a>
            </div>
          </motion.div>

          {/* RIGHT: orbit visual */}
          <motion.div
            className="flex-shrink-0"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <OrbitVisual />
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default Hero