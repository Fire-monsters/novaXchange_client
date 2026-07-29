import React, { useEffect } from 'react'
import { useLocation, Routes, Route } from 'react-router-dom'


import { CartProvider } from './context/CartContext'
import { CustomerAuthProvider } from './context/CustomerAuthContext'
import AccessoriesPage from './pages/AccessoriesPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderStatusPage from './pages/OrderStatusPage'
import CustomerLogin from './pages/account/CustomerLogin'
import CustomerRegister from './pages/account/CustomerRegister'
import GoogleCallback from './pages/account/GoogleCallback'
import AccountPage from './pages/account/AccountPage'
import { CustomerGuard } from './account/CustomerGuard'

// Admin
import { AdminGuard } from './admin/AdminGuard'
import { AdminLayout } from './admin/AdminLayout'
import AdminLogin from './admin/pages/AdminLogin'
import Dashboard from './admin/pages/Dashboard'
import ProductsTable from './admin/pages/ProductsTable'
import UploadProduct from './admin/pages/UploadProduct'
import Categories from './admin/pages/Categories'
import AdminVerify from './admin/pages/AdminVerify'
import OrdersTable from './admin/pages/OrdersTable'
import OrderDetail from './admin/pages/OrderDetail'
import CustomersTable from './admin/pages/CustomersTable'
import BundleSettings from './admin/pages/BundleSettings'

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

import ScrollToTopButton from './components/ui/ScrollToTopButton'

import { useScrollReveal } from './hooks/useScrollReveal'
import BundleDealsPopup from './components/ui/BundleDealsPopup'
import Seo from './components/seo/Seo'

const HomePage = () => {
  useScrollReveal()
  return (
    <div className="relative">
      <Seo />
      <BundleDealsPopup />
      {/* <CustomCursor /> */}
      <ScrollToTopButton />
      <Navbar />
      <Hero />
      <Marquee />
      <Problem />
      <Solutions />
      <About />
      <AccessoriesPreview />
      <LeadCapture />
      {/* <Testimonials /> */}
      <Cta />
      <Footer />
      <FloatingWhatsApp />
    </div>
  )
}

function App() {
  const location = useLocation()

  useEffect(() => {
    if (typeof window.gtag !== 'function') return
    window.gtag('event', 'page_view', {
      page_path: location.pathname + location.search,
    })
  }, [location])

  return (
    <CustomerAuthProvider>
      <CartProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/accessories" element={<AccessoriesPage />} />
          <Route path="/accessories/:slug" element={<AccessoriesPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders/:orderNumber" element={<OrderStatusPage />} />

          <Route path="/account/login" element={<CustomerLogin />} />
          <Route path="/account/register" element={<CustomerRegister />} />
          <Route path="/account/google-callback" element={<GoogleCallback />} />
          <Route path="/account" element={<CustomerGuard><AccountPage /></CustomerGuard>} />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/verify" element={<AdminVerify />} />
          <Route path="/admin" element={<AdminGuard><AdminLayout><Dashboard /></AdminLayout></AdminGuard>} />
          <Route path="/admin/products" element={<AdminGuard><AdminLayout><ProductsTable /></AdminLayout></AdminGuard>} />
          <Route path="/admin/products/upload" element={<AdminGuard><AdminLayout><UploadProduct /></AdminLayout></AdminGuard>} />
          <Route path="/admin/products/edit/:id" element={<AdminGuard><AdminLayout><UploadProduct /></AdminLayout></AdminGuard>} />
          <Route path="/admin/categories" element={<AdminGuard><AdminLayout><Categories /></AdminLayout></AdminGuard>} />
          <Route path="/admin/orders" element={<AdminGuard><AdminLayout><OrdersTable /></AdminLayout></AdminGuard>} />
          <Route path="/admin/orders/:id" element={<AdminGuard><AdminLayout><OrderDetail /></AdminLayout></AdminGuard>} />
          <Route path="/admin/customers" element={<AdminGuard><AdminLayout><CustomersTable /></AdminLayout></AdminGuard>} />
          <Route path="/admin/settings" element={<AdminGuard><AdminLayout><BundleSettings /></AdminLayout></AdminGuard>} />
        </Routes>
        <ScrollToTopButton />
      </CartProvider>
    </CustomerAuthProvider>
  )
}

export default App