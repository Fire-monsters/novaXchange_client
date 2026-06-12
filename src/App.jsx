/**
 * App.jsx
 * Root layout + routing.
 *
 * Routes:
 *   /              → homepage (all sections)
 *   /accessories   → AccessoriesPage (full catalogue, cart, modal)
 *
 * CartProvider wraps everything so the cart badge in Navbar and the
 * AccessoriesPreview "Add to cart" quick-add both share the same state,
 * even before the user navigates to /accessories.
 */

import React from 'react'
import { Routes, Route } from 'react-router-dom'

import { CartProvider } from './context/CartContext'
import AccessoriesPage from './pages/AccessoriesPage'

// ── Homepage sections
import Navbar             from './components/ui/Navbar'
import FloatingWhatsApp   from './components/ui/FloatingWhatsApp'
import Footer             from './components/ui/Footer'
import Hero               from './components/sections/Hero'
import Marquee            from './components/sections/Marquee'
import Problem            from './components/sections/Problem'
import Solutions          from './components/sections/Solutions'
import AccessoriesPreview from './components/sections/AccessoriesPreview'
import About              from './components/sections/About'
import LeadCapture        from './components/sections/LeadCapture'
import Cta                from './components/sections/Cta'
import Testimonials       from './components/sections/Testimonials'
import CustomCursor       from './components/ui/Cursor'

import { useScrollReveal } from './hooks/useScrollReveal'

// ── Homepage (all sections assembled)
const HomePage = () => {
  useScrollReveal()

  return (
    <div className="relative">
      <CustomCursor />
      <Navbar />
      <Hero />
      <Marquee />
      <Problem />
      <Solutions />
      <About />
      <AccessoriesPreview />
      <LeadCapture />
      <Testimonials />
      <Cta />
      <Footer />
      <FloatingWhatsApp />
    </div>
  )
}

// ── Root
function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/"             element={<HomePage />} />
        <Route path="/accessories"  element={<AccessoriesPage />} />
      </Routes>
    </CartProvider>
  )
}

export default App