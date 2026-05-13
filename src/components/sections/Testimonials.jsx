import React from 'react'
import { motion } from 'framer-motion'
import { FaStar, FaStarHalfAlt } from 'react-icons/fa'

const testimonials = [
  {
    name: 'Aisha Kamukama',
    role: '3rd Year, Makerere University',
    content: 'I traded my old HP that kept freezing during lectures. Paid a 3-month top-up and now I have a Dell with 16GB RAM. Best decision of my campus life.',
    rating: 5,
    avatar: 'AK',
  },
  {
    name: 'Brian Mubiru',
    role: 'Software Dev Student, UCU',
    content: 'The accessories are 100% genuine. I bought a mouse and keyboard protector — the quality is night and day compared to what I used to get on the street.',
    rating: 5,
    avatar: 'BM',
  },
  {
    name: 'Carol Lubega',
    role: 'Graphic Design, Kyambogo',
    content: 'The team was transparent about the valuation and the whole swap took under 30 minutes. I didn\'t expect it to be that smooth. Highly recommend.',
    rating: 4.5,
    avatar: 'CL',
  },
]

const Testimonials = () => {
  return (
    <section className="py-20 bg-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 reveal">
          <div className="section-tag inline-block bg-yellow text-ink rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wide mb-3">
            Real Voices
          </div>
          <h2 className="font-bricolage text-3xl md:text-4xl font-bold">
            Loved by Students Across Uganda
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              className="bg-white p-6 rounded-2xl border-2 border-ink shadow-[4px_4px_0_#120D1E] hover:shadow-[6px_6px_0_#6C2BD9] transition-all"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="flex gap-1 text-yellow-deep mb-3">
                {[...Array(5)].map((_, i) => (
                  i < Math.floor(t.rating) ? <FaStar key={i} /> : i < t.rating ? <FaStarHalfAlt key={i} /> : <FaStar key={i} className="text-gray-300" />
                ))}
              </div>
              <p className="text-gray-700 italic mb-4">"{t.content}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-violet text-yellow flex items-center justify-center font-bold">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-bold">{t.name}</div>
                  <div className="text-xs text-gray">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials