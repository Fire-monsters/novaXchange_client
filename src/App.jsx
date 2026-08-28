import React, { useEffect } from 'react'
import { useLocation, Routes, Route } from 'react-router-dom'


import { CartProvider } from './context/CartContext'
import { BuyNowProvider } from './context/BuyNowContext'
import { CustomerAuthProvider } from './context/CustomerAuthContext'
import AccessoriesPage from './pages/AccessoriesPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderStatusPage from './pages/OrderStatusPage'
import OrderSuccessPage from './pages/OrderSuccessPage'
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
import PackageImages from './admin/pages/PackageImages'

// Layouts
import { PublicLayout } from './layouts/PublicLayout'
import { TransactionLayout } from './layouts/TransactionLayout'

// Homepage sections
import FloatingWhatsApp from './components/ui/FloatingWhatsApp'
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
      <Hero />
      <Marquee />
      <Problem />
      <Solutions />
      <About />
      <AccessoriesPreview />
      <LeadCapture />
      {/* <Testimonials /> */}
      <Cta />
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
        <BuyNowProvider>
          <Routes>
          <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
          <Route path="/accessories" element={<PublicLayout><AccessoriesPage /></PublicLayout>} />
          <Route path="/accessories/:slug" element={<PublicLayout><AccessoriesPage /></PublicLayout>} />
          <Route path="/checkout" element={<CustomerGuard><TransactionLayout><CheckoutPage /></TransactionLayout></CustomerGuard>} />
          <Route path="/orders/:orderNumber" element={<TransactionLayout><OrderStatusPage /></TransactionLayout>} />
          <Route path="/orders/:orderNumber/success" element={<TransactionLayout><OrderSuccessPage /></TransactionLayout>} />

          <Route path="/account/login" element={<TransactionLayout><CustomerLogin /></TransactionLayout>} />
          <Route path="/account/register" element={<TransactionLayout><CustomerRegister /></TransactionLayout>} />
          <Route path="/account/google-callback" element={<TransactionLayout><GoogleCallback /></TransactionLayout>} />
          <Route path="/account" element={<CustomerGuard><PublicLayout><AccountPage /></PublicLayout></CustomerGuard>} />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/verify" element={<AdminVerify />} />
          <Route path="/admin" element={<AdminGuard><AdminLayout><Dashboard /></AdminLayout></AdminGuard>} />
          <Route path="/admin/products" element={<AdminGuard><AdminLayout><ProductsTable /></AdminLayout></AdminGuard>} />
          <Route path="/admin/products/upload" element={<AdminGuard><AdminLayout><UploadProduct /></AdminLayout></AdminGuard>} />
          <Route path="/admin/products/edit/:id" element={<AdminGuard><AdminLayout><UploadProduct /></AdminLayout></AdminGuard>} />
          <Route path="/admin/categories" element={<AdminGuard><AdminLayout><Categories /></AdminLayout></AdminGuard>} />
          <Route path="/admin/packages" element={<AdminGuard><AdminLayout><PackageImages /></AdminLayout></AdminGuard>} />
          <Route path="/admin/orders" element={<AdminGuard><AdminLayout><OrdersTable /></AdminLayout></AdminGuard>} />
          <Route path="/admin/orders/:id" element={<AdminGuard><AdminLayout><OrderDetail /></AdminLayout></AdminGuard>} />
          <Route path="/admin/customers" element={<AdminGuard><AdminLayout><CustomersTable /></AdminLayout></AdminGuard>} />
          <Route path="/admin/settings" element={<AdminGuard><AdminLayout><BundleSettings /></AdminLayout></AdminGuard>} />
          </Routes>
          <ScrollToTopButton />
        </BuyNowProvider>
      </CartProvider>
    </CustomerAuthProvider>
  )
}

export default App