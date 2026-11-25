import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { PageRoute } from '../types';
import { SpacupiedLogo } from './SpacupiedLogo';

interface NavbarProps {
  currentPage: PageRoute;
  onNavigate: (page: PageRoute) => void;
}

const NAV_ITEMS: { label: string; page: PageRoute }[] = [
  { label: 'Home', page: 'home' },
  { label: 'Properties', page: 'listings' },
  { label: 'About', page: 'about' },
  { label: 'FAQs', page: 'faqs' },
  { label: 'Contact', page: 'contact' },
];

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLinkClick = (page: PageRoute) => {
    setMobileOpen(false);
    onNavigate(page);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-[#EDE9FE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleLinkClick('home')}
          className="flex items-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7C3AED] rounded-lg cursor-pointer shrink-0"
          aria-label="Spacupied Home"
        >
          <SpacupiedLogo />
        </button>

        {/* Zone 2: Five concise single-line text navigation links */}
        <nav aria-label="Primary Navigation" className="hidden md:flex items-center gap-7">
          {NAV_ITEMS.map((item) => {
            const isActive =
              currentPage === item.page ||
              (item.page === 'listings' && currentPage === 'property-detail');
            return (
              <button
                key={item.page}
                type="button"
                onClick={() => handleLinkClick(item.page)}
                className={`relative py-1 text-sm font-medium transition-colors duration-200 whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'text-[#7C3AED]'
                    : 'text-[#4B4B4B] hover:text-[#7C3AED]'
                }`}
              >
                {item.label}
                <span
                  className={`absolute left-0 right-0 -bottom-0.5 h-[2px] rounded-full bg-[#7C3AED] transition-opacity duration-200 ${
                    isActive ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single primary action CTA + Mobile menu toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleLinkClick('list-property')}
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl transition-colors duration-200 whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
          >
            List Your Property
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-xl border border-[#EDE9FE] text-[#222222] hover:bg-[#F5F3FF] transition-colors cursor-pointer"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-[#EDE9FE] px-4 pt-3 pb-5 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              currentPage === item.page ||
              (item.page === 'listings' && currentPage === 'property-detail');
            return (
              <button
                key={item.page}
                type="button"
                onClick={() => handleLinkClick(item.page)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#EDE9FE] text-[#7C3AED]'
                    : 'text-[#222222] hover:bg-[#FAF8FF]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => handleLinkClick('list-property')}
              className="w-full py-3 px-4 text-sm font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl transition-colors cursor-pointer"
            >
              List Your Property
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
