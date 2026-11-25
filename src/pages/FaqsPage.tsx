import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { PageRoute } from '../types';

interface FaqsPageProps {
  onNavigate: (page: PageRoute) => void;
}

const FAQ_ITEMS = [
  {
    q: 'What types of properties are available on Spacupied?',
    a: 'Spacupied focuses exclusively on rental and leasing spaces in Chennai, Tamil Nadu—including houses and apartments for rent, residential land and plots for lease, commercial properties, retail shops and office spaces, agricultural land, and multi-year residential or commercial leases.',
  },
  {
    q: 'Are the listings currently displayed real properties?',
    a: 'Listings marked "Sample Listing" are clearly identified illustrative examples created to demonstrate search filters, category layouts, pricing formats, and interactive Chennai locality maps. Any property submitted through the "List Your Property" page appears immediately in your catalogue as an "Owner Listing".',
  },
  {
    q: 'What is the difference between Rent and Lease on Spacupied?',
    a: 'Rent typically involves a monthly rental payment paired with a refundable security deposit (commonly on an 11-month or 24-month agreement in Chennai). Lease refers to a lump-sum or structured multi-year occupancy arrangement—popular for residential duplexes, commercial floors, land plots, and agricultural estates.',
  },
  {
    q: 'How can landlords or landowners list a property?',
    a: 'Use the "List Your Property" button in the navigation bar to enter your property category, Chennai locality, monthly rent or lease pricing, area size, amenities, and an optional photograph. Once submitted, your listing is immediately searchable in the directory.',
  },
  {
    q: 'Why does Spacupied not display public phone numbers?',
    a: 'To protect the privacy of property owners, landlords, and tenants from unsolicited calls, Spacupied never displays phone numbers publicly. Instead, users can submit structured enquiries directly on any listing or launch an opt-in WhatsApp enquiry message.',
  },
  {
    q: 'Which Chennai localities does Spacupied cover?',
    a: 'Spacupied covers major neighborhoods across Chennai and Greater Chennai, including Adyar, Anna Nagar, OMR (IT Corridor), Nungambakkam, Velachery, Guindy, ECR (East Coast Road), T. Nagar, Alwarpet, Sholinganallur, Porur, and agricultural belts around Chengalpattu outskirts.',
  },
];

export const FaqsPage: React.FC<FaqsPageProps> = ({ onNavigate }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="mb-10">
          <p className="text-sm font-medium text-[#7C3AED] mb-2">Frequently Asked Questions</p>
          <h1 className="font-display text-4xl font-semibold text-[#222222] mb-3">
            Clear Answers for Tenants &amp; Owners
          </h1>
          <p className="text-base text-[#555555] max-w-2xl">
            Everything you need to know about renting, leasing, and submitting properties across
            Chennai on Spacupied.
          </p>
        </div>

        <div className="divide-y divide-[#EDE9FE] border-y border-[#EDE9FE]">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={item.q} className="py-5">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 text-left cursor-pointer group"
                >
                  <span className="text-base sm:text-lg font-semibold text-[#222222] group-hover:text-[#7C3AED] transition-colors">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#7C3AED] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="mt-3.5 text-sm sm:text-base text-[#555555] leading-relaxed pr-8">
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 rounded-2xl bg-[#FAF8FF] border border-[#DDD6FE] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-[#222222]">Still have a question?</h2>
            <p className="text-sm text-[#555555] mt-1">
              Reach out through our Contact Us form or WhatsApp messaging assistant.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('contact')}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl transition-colors cursor-pointer whitespace-nowrap"
          >
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
};
