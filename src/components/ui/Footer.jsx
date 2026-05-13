import React from 'react'
import { FaTwitter, FaInstagram, FaLinkedinIn, FaGithub } from 'react-icons/fa'
import { HiMail } from 'react-icons/hi'

const socialLinks = [
  { icon: FaTwitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: FaInstagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: FaLinkedinIn, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: FaGithub, href: 'https://github.com', label: 'GitHub' },
]

const footerLinks = [
  { name: 'About Us', href: '#about' },
  { name: 'Services', href: '#solutions' },
  { name: 'Trade-In', href: '#lead-capture' },
  { name: 'Privacy Policy', href: '#' },
  { name: 'Contact', href: '#footer' },
]

const Footer = () => {
  return (
    <footer id="footer" className="bg-ink text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow to-violet rounded-full" />
              <span className="font-bricolage font-bold text-xl">nova<span className="text-yellow">X</span>change</span>
            </div>
            <p className="text-gray-400 text-sm">
              Empowering Uganda's students and professionals to upgrade their tech, affordably and authentically.
            </p>
            <div className="flex gap-4 mt-4">
              {socialLinks.map((Social, idx) => (
                <a
                  key={idx}
                  href={Social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-yellow hover:text-ink transition-colors duration-200"
                >
                  <Social.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-3">Quick Links</h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-gray-400 hover:text-yellow text-sm transition">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold mb-3">Contact</h4>
            <div className="space-y-2 text-gray-400 text-sm">
              <p className="flex items-center gap-2">
                <HiMail className="text-yellow" /> hello@novaxchange.ug
              </p>
              <p>📍 Kampala, Uganda</p>
              <p>📞 +256 700 000 000</p>
            </div>
          </div>

          {/* Newsletter Placeholder (Future) */}
          <div>
            <h4 className="font-bold mb-3">Stay Updated</h4>
            <p className="text-gray-400 text-sm mb-2">Get the latest deals and trade-in offers.</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="bg-white/10 border border-white/20 rounded-l-full px-3 py-2 text-sm w-full focus:outline-none focus:border-yellow"
              />
              <button className="bg-yellow text-ink px-4 py-2 rounded-r-full text-sm font-bold hover:bg-yellow-deep transition">
                →
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 text-center text-gray-500 text-xs">
          © 2025 novaXchange — Trade Up. Level Up. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer