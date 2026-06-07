import React from 'react'
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
      {/*accessories sec*/}
      <LeadCapture />
      {/* Testimonials should be after the lead capture to maximize social proof before the final CTA */}
      <Testimonials />
      <Cta />
      <Footer />
      <FloatingWhatsApp />
    </div>
  )
}

export default App
