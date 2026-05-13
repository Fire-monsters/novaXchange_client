import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FaWhatsapp, FaGoogle } from 'react-icons/fa'
import { calculateTradeInValue } from '../../utils/tradeInCalculator'

const LeadCapture = () => {
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    condition: '',
    ram: '',
    whatsapp: '',
  })
  const [estimatedValue, setEstimatedValue] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const calculateEstimate = () => {
    const { brand, year, condition, ram } = formData
    if (brand && year && condition && ram && brand !== 'Select brand...') {
      const value = calculateTradeInValue({ brand, year, condition, ram })
      setEstimatedValue(value)
    } else {
      setEstimatedValue(null)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Future: API call to backend
    alert(`Estimate: UGX ${estimatedValue?.toLocaleString() ?? 'N/A'}. We'll contact you on ${formData.whatsapp}`)
  }

  const googleFormUrl = 'https://forms.gle/VaGtSqmD4bEi1gSo7'

  return (
    <section id="lead-capture" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: Info */}
          <div className="reveal">
            <div className="section-tag inline-block bg-yellow text-ink rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wide mb-3">
              Get Instant Estimate
            </div>
            <h2 className="font-bricolage text-3xl md:text-4xl font-bold mb-4">
              What's Your Device Worth?
            </h2>
            <p className="text-gray mb-6">
              Fill the form to get a real-time trade-in value. Takes less than 2 minutes – no commitment required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={googleFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-50 text-red-600 border border-red-200 rounded-full px-5 py-2 flex items-center gap-2 font-semibold hover:bg-red-100 transition"
              >
                <FaGoogle /> Fill Google Form
              </a>
              <a
                href="https://wa.me/256700000000?text=Hello%20novaXchange%2C%20I%20need%20help%20with%20trade-in%20estimate"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-50 text-green-700 border border-green-200 rounded-full px-5 py-2 flex items-center gap-2 font-semibold hover:bg-green-100 transition"
              >
                <FaWhatsapp /> WhatsApp Us
              </a>
            </div>
          </div>

          {/* Right: Form */}
          <div className="bg-off-white border-2 border-ink rounded-2xl p-6 shadow-[8px_8px_0_#120D1E] reveal">
            <h3 className="font-bricolage text-xl font-bold mb-4">Trade-In Estimate</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold">Device Brand *</label>
                  <select
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    onBlur={calculateEstimate}
                    className="w-full mt-1 p-2 border-2 border-ink rounded-lg bg-white"
                    required
                  >
                    <option>Select brand...</option>
                    <option>Apple (MacBook)</option><option>Dell</option><option>Lenovo</option>
                    <option>HP</option><option>Asus</option><option>Acer</option><option>Samsung</option><option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold">Model / Series</label>
                  <input
                    type="text"
                    name="model"
                    placeholder="e.g. Dell Inspiron 15"
                    value={formData.model}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 border-2 border-ink rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold">Year of Purchase *</label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    onBlur={calculateEstimate}
                    className="w-full mt-1 p-2 border-2 border-ink rounded-lg bg-white"
                    required
                  >
                    <option>Select year...</option>
                    <option>2024</option><option>2023</option><option>2022</option>
                    <option>2021</option><option>2020</option><option>2019</option><option>2018 or older</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold">Condition *</label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    onBlur={calculateEstimate}
                    className="w-full mt-1 p-2 border-2 border-ink rounded-lg bg-white"
                    required
                  >
                    <option>Select...</option>
                    <option>Excellent (like new)</option>
                    <option>Good (minor scratches)</option>
                    <option>Fair (visible wear)</option>
                    <option>Poor (damaged)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold">RAM *</label>
                  <select
                    name="ram"
                    value={formData.ram}
                    onChange={handleChange}
                    onBlur={calculateEstimate}
                    className="w-full mt-1 p-2 border-2 border-ink rounded-lg bg-white"
                    required
                  >
                    <option>Select RAM...</option>
                    <option>4GB</option><option>8GB</option><option>16GB</option><option>32GB+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold">WhatsApp Number *</label>
                  <input
                    type="tel"
                    name="whatsapp"
                    placeholder="+256 7XX XXX XXX"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 border-2 border-ink rounded-lg bg-white"
                    required
                  />
                </div>
              </div>

              {estimatedValue && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-violet p-4 rounded-xl text-white text-center"
                >
                  <div className="text-sm font-semibold">Estimated Trade-In Value</div>
                  <div className="font-bricolage text-3xl font-bold">UGX {estimatedValue.toLocaleString()}</div>
                </motion.div>
              )}

              <button type="submit" className="w-full btn-primary justify-center">
                Get My Estimate →
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LeadCapture