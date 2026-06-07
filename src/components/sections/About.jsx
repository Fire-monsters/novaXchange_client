import React from 'react'
import { motion } from 'framer-motion'
import { FaHeart, FaUsers, FaGem, FaShieldAlt, FaRocket, FaLightbulb } from 'react-icons/fa'

const values = [
  { icon: FaGem, title: 'Transparency', desc: 'Clear valuations, no hidden fees.' },
  { icon: FaShieldAlt, title: 'Trust', desc: 'Verified sellers, genuine products.' },
  { icon: FaHeart, title: 'Student-First', desc: 'Flexible payments designed for students.' },
  { icon: FaUsers, title: 'Community', desc: 'Built by Ugandans, for Ugandans.' },
]

const goals = [
  { number: '500+', label: 'Trades Completed' },
  { number: '98%', label: 'Customer Satisfaction' },
  { number: '15+', label: 'Campuses Reached' },
  { number: '0%', label: 'Fake Products' },
]

const About = () => {
  return (
    <section id="about" className="py-20 bg-light-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Mission & Vision */}
          <div className="reveal">
            <div className="section-tag inline-block bg-violet-pale text-violet rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wide mb-3">
              Our Story
            </div>
            <h2 className="font-bricolage text-3xl md:text-4xl font-bold mb-4">
              Mission & Vision
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                <strong className="text-violet">Mission:</strong> To empower every Ugandan student to access reliable, high-performance technology through affordable trade-ins, genuine accessories, and trusted service.
              </p>
              <p>
                <strong className="text-violet">Vision:</strong> Create an upgrade culture across Africa where no student is held back by outdated devices.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-6">
                {goals.map((goal, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-xl border border-gray-200 text-center">
                    <div className="font-bricolage text-2xl font-bold text-violet">{goal.number}</div>
                    <div className="text-xs text-gray uppercase">{goal.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Core Values */}
          <div className="reveal">
            <h3 className="font-bricolage text-2xl font-bold mb-6">Our Core Values</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {values.map((val, idx) => (
                <motion.div
                  key={idx}
                  className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition"
                  whileHover={{ y: -4 }}
                >
                  <val.icon className="text-violet text-2xl mb-2" />
                  <h4 className="font-bold">{val.title}</h4>
                  <p className="text-gray text-xs">{val.desc}</p>
                </motion.div>
              ))}
            </div>
            <div className="mt-8 bg-gradient-to-r from-violet to-pink p-5 rounded-2xl text-white text-center">
              <FaLightbulb className="inline-block text-yellow text-2xl mr-2" />

              <span className="font-semibold">Startup growth vision:</span> We're building Africa's largest student-first tech ecosystem.
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About