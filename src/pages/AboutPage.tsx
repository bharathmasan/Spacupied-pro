import React from 'react';
import { ArrowRight } from 'lucide-react';
import { IMG_COMMERCIAL_TOWER } from '../data/sampleProperties';
import { PageRoute } from '../types';

interface AboutPageProps {
  onNavigate: (page: PageRoute) => void;
}

const PRINCIPLES = [
  {
    index: '01.',
    title: 'Dedicated Strictly to Renting & Leasing',
    body: 'Rather than mixing speculative property sales with leasing inquiries, Spacupied focuses exclusively on residential rentals, multi-year property leases, commercial suites, plots, and agricultural estates.',
  },
  {
    index: '02.',
    title: 'Built Around Chennai’s Real Neighborhoods',
    body: 'From heritage residential pockets like Adyar, Alwarpet, and Anna Nagar to commercial hubs along OMR, Guindy, and Nungambakkam—and fertile farmland on the outskirts—our taxonomy mirrors how Chennai actually leases space.',
  },
  {
    index: '03.',
    title: 'Privacy-First Communication',
    body: 'Owners and prospective tenants deserve dignified, spam-free communication. Spacupied eliminates exposed public phone numbers in favor of structured digital enquiries and opt-in WhatsApp messaging.',
  },
  {
    index: '04.',
    title: 'Clarity Across Every Asset Class',
    body: 'Whether comparing monthly residential rent in sq.ft, corner plot dimensions in grounds, or agricultural acreage, every listing presents transparent terms, orientation, and availability.',
  },
];

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="bg-white">
      {/* Intro Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-14 border-b border-[#F3F0FF]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <p className="text-sm font-medium text-[#7C3AED]">About Spacupied</p>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#222222] leading-[1.12]">
              A Modern Rental &amp; Leasing Platform Crafted for Chennai.
            </h1>
            <p className="text-base sm:text-lg text-[#555555] leading-relaxed max-w-2xl">
              Spacupied was created to bring calm, structure, and trust to property rentals and
              leasing across Chennai, Tamil Nadu. We connect property owners, landlords, landowners,
              families, and growing enterprises through clear listings and effortless discovery.
            </p>
          </div>
          <div className="lg:col-span-5">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-[#EDE9FE] bg-[#FAF8FF]">
              <img
                src={IMG_COMMERCIAL_TOWER}
                alt="Modern Chennai commercial architecture representing Spacupied"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Core Principles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-2xl mb-12">
          <p className="text-sm font-medium text-[#7C3AED] mb-2">How We Think</p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#222222]">
            Designed for Transparency and Ease
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          {PRINCIPLES.map((item) => (
            <div key={item.index} className="pt-6 border-t border-[#EDE9FE] space-y-2.5">
              <p className="text-sm font-semibold text-[#7C3AED] tabular-nums">{item.index}</p>
              <h3 className="text-xl font-semibold text-[#222222]">{item.title}</h3>
              <p className="text-sm sm:text-base text-[#555555] leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Who We Serve */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="rounded-3xl bg-[#FAF8FF] border border-[#DDD6FE] p-8 sm:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-2xl space-y-3">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#222222]">
              Ready to Explore or List a Space in Chennai?
            </h2>
            <p className="text-sm sm:text-base text-[#555555] leading-relaxed">
              Browse illustrative sample listings across residential, commercial, plot, and
              agricultural categories, or submit your own property directly.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('listings')}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>Explore Properties</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('list-property')}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-[#7C3AED] bg-white border border-[#C4B5FD] hover:bg-[#EDE9FE]/50 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>List Your Property</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
