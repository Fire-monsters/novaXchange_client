import React from 'react'
import { Routes, Route } from 'react-router-dom'

import { CartProvider } from './context/CartContext'
import AccessoriesPage from './pages/AccessoriesPage'

// Admin
import { AdminGuard } from './admin/AdminGuard'
import { AdminLayout } from './admin/AdminLayout'
import AdminLogin from './admin/pages/AdminLogin'
import Dashboard from './admin/pages/Dashboard'
import ProductsTable from './admin/pages/ProductsTable'
import UploadProduct from './admin/pages/UploadProduct'
import Categories from './admin/pages/Categories'

// Homepage sections
import Navbar from './components/ui/Navbar'
import FloatingWhatsApp from './components/ui/FloatingWhatsApp'
import Footer from './components/ui/Footer'
import Hero from './components/sections/Hero'
import Marquee from './components/sections/Marquee'
import Problem from './components/sections/Problem'
import Solutions from './components/sections/Solutions'
import AccessoriesPreview from './components/sections/AccessoriesPreview'
import About from './components/sections/About'
import LeadCapture from './components/sections/LeadCapture'
import Cta from './components/sections/Cta'
import Testimonials from './components/sections/Testimonials'
import CustomCursor from './components/ui/Cursor'

import { useScrollReveal } from './hooks/useScrollReveal'

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

function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/accessories" element={<AccessoriesPage />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminGuard><AdminLayout><Dashboard /></AdminLayout></AdminGuard>} />
        <Route path="/admin/products" element={<AdminGuard><AdminLayout><ProductsTable /></AdminLayout></AdminGuard>} />
        <Route path="/admin/products/upload" element={<AdminGuard><AdminLayout><UploadProduct /></AdminLayout></AdminGuard>} />
        <Route path="/admin/products/edit/:id" element={<AdminGuard><AdminLayout><UploadProduct /></AdminLayout></AdminGuard>} />
        <Route path="/admin/categories" element={<AdminGuard><AdminLayout><Categories /></AdminLayout></AdminGuard>} />
      </Routes>
    </CartProvider>
  )
}

export default App