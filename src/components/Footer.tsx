import React from 'react';
import { MessageCircle } from 'lucide-react';
import { PageRoute, PropertyCategory } from '../types';
import { SpacupiedLogo } from './SpacupiedLogo';

interface FooterProps {
  onNavigate: (page: PageRoute) => void;
  onSelectCategory: (category: PropertyCategory) => void;
  onOpenWhatsApp: (contextText?: string) => void;
}

const FOOTER_CATEGORIES: PropertyCategory[] = [
  'Houses & Apartments',
  'Residential Land & Plots',
  'Commercial Properties',
  'Shops & Office Spaces',
  'Agricultural Land',
  'Residential & Commercial Leasing',
];

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onSelectCategory,
  onOpenWhatsApp,
}) => {
  return (
    <footer className="bg-white border-t border-[#EDE9FE] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#F3F0FF]">
          {/* Brand Column */}
          <div className="md:col-span-4 space-y-4">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7C3AED] rounded-lg"
            >
              <SpacupiedLogo />
            </button>
            <p className="text-sm leading-relaxed text-[#555555] max-w-sm">
              A dedicated rental and leasing platform connecting property owners, landlords,
              landowners, tenants, and businesses across Chennai, Tamil Nadu.
            </p>
            <p className="text-xs text-[#6B7280]">
              Serving Chennai &amp; Greater Chennai, Tamil Nadu, India
            </p>
            <div className="pt-1">
              <button
                type="button"
                onClick={() =>
                  onOpenWhatsApp(
                    'Hello Spacupied team, I would like assistance with rental or leasing properties in Chennai.'
                  )
                }
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#7C3AED] bg-[#EDE9FE]/70 hover:bg-[#EDE9FE] rounded-xl transition-colors cursor-pointer whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Connect on WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Explore Links */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-sm font-semibold text-[#222222]">Platform</h3>
            <ul className="space-y-2.5 text-sm text-[#555555]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#7C3AED] transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('listings')}
                  className="hover:text-[#7C3AED] transition-colors cursor-pointer"
                >
                  Property Listings
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('list-property')}
                  className="hover:text-[#7C3AED] transition-colors cursor-pointer"
                >
                  List Your Property
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="hover:text-[#7C3AED] transition-colors cursor-pointer"
                >
                  About Us
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-sm font-semibold text-[#222222]">Categories</h3>
            <ul className="space-y-2.5 text-sm text-[#555555]">
              {FOOTER_CATEGORIES.map((category) => (
                <li key={category}>
                  <button
                    type="button"
                    onClick={() => onSelectCategory(category)}
                    className="text-left hover:text-[#7C3AED] transition-colors cursor-pointer"
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Legal */}
          <div className="md:col-span-2 space-y-3">
            <h3 className="text-sm font-semibold text-[#222222]">Support</h3>
            <ul className="space-y-2.5 text-sm text-[#555555]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('faqs')}
                  className="hover:text-[#7C3AED] transition-colors cursor-pointer"
                >
                  FAQs
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="hover:text-[#7C3AED] transition-colors cursor-pointer"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('privacy')}
                  className="hover:text-[#7C3AED] transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Sample Transparency Note */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#6B7280]">
          <p>© {new Date().getFullYear()} Spacupied · Chennai, Tamil Nadu, India. All rights reserved.</p>
          <p>
            Featured properties marked as Sample Listings are illustrative examples for preview purposes.
          </p>
        </div>
      </div>
    </footer>
  );
};
