import React, { useEffect } from 'react'
import Navbar from './components/ui/Navbar'
import FloatingWhatsApp from './components/ui/FloatingWhatsApp'
import Footer from './components/ui/Footer'
import Hero from './components/sections/Hero'
import Marquee from './components/sections/Marquee'
import Problem from './components/sections/Problem'
import Solutions from './components/sections/Solutions'
import About from './components/sections/About'
import LeadCapture from './components/sections/LeadCapture'
import Cta from './components/sections/Cta'
import Testimonials from './components/sections/Testimonials'
import CustomCursor from './components/ui/Cursor'   // ← new
import { useScrollReveal } from './hooks/useScrollReveal'

function App() {
  useScrollReveal()

  useEffect(() => {
    const handleScroll = () => {
      const nav = document.querySelector('nav')
      if (nav) {
        nav.style.boxShadow = window.scrollY > 40
          ? '0 4px 20px rgba(0,0,0,0.1)'
          : 'none'
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="relative">
      {/* Cursor must be outside any overflow:hidden container */}
      <CustomCursor />
      <Navbar />
      <Hero />
      <Marquee />
      <Problem />
      <Solutions />
      <About />
      <LeadCapture />
      {/*<Testimonials />*/}
      <Cta />
      <Footer />
      <FloatingWhatsApp />
    </div>
  )
}

export default App