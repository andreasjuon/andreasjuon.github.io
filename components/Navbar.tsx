'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiHome, FiBook, FiDatabase, FiBriefcase, FiTool, FiMic, FiMail, FiMenu, FiX } from 'react-icons/fi'

const navItems = [
  { href: '/', label: 'Home', icon: FiHome, iconOnly: true },
  { href: '/research', label: 'Research', icon: FiBook },
  { href: '/data', label: 'Data', icon: FiDatabase },
  { href: '/consulting', label: 'Consulting', icon: FiBriefcase },
  { href: '/tools', label: 'Tools', icon: FiTool },
  { href: '/engagement', label: 'Public Engagement', icon: FiMic },
  { href: '/contact', label: 'Contact', icon: FiMail, iconOnly: true },
]

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="bg-primary-dark sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-around h-14">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href))
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
                  isActive
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
                aria-label={item.label}
              >
                <Icon className="w-5 h-5" />
                {!item.iconOnly && <span>{item.label}</span>}
              </Link>
            )
          })}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center justify-between h-14">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white p-2"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href))
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded transition-colors ${
                      isActive
                        ? 'bg-gray-700 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
