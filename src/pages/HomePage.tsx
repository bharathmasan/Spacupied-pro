import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  MapPin,
  MessageCircle,
  Search,
} from 'lucide-react';
import {
  CHENNAI_LOCALITIES,
  IMG_HERO_RESIDENCE,
  PROPERTY_CATEGORIES,
} from '../data/sampleProperties';
import { ListingType, PageRoute, Property, PropertyCategory, SearchFilters } from '../types';
import { PropertyCard } from '../components/PropertyCard';

interface HomePageProps {
  properties: Property[];
  onNavigate: (page: PageRoute) => void;
  onSelectProperty: (id: string) => void;
  onApplySearch: (partialFilters: Partial<SearchFilters>) => void;
  onOpenWhatsApp: (contextText?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  properties,
  onNavigate,
  onSelectProperty,
  onApplySearch,
  onOpenWhatsApp,
}) => {
  const [heroLocality, setHeroLocality] = useState<string>('All');
  const [heroCategory, setHeroCategory] = useState<PropertyCategory | 'All'>('All');
  const [heroType, setHeroType] = useState<ListingType | 'All'>('All');
  const [heroBudget, setHeroBudget] = useState<string>('any');
  const [heroImageError, setHeroImageError] = useState(false);

  const featuredProperties = properties.filter((p) => p.featured).slice(0, 6);
  const popularLocations = CHENNAI_LOCALITIES.slice(0, 8);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const nextFilters: Partial<SearchFilters> = {
      locality: heroLocality,
      category: heroCategory,
      listingType: heroType,
      minRent: '',
      maxRent: '',
      minLease: '',
      maxLease: '',
    };

    if (heroBudget === 'rent-under-50k') {
      nextFilters.listingType = 'Rent';
      nextFilters.maxRent = '50000';
    } else if (heroBudget === 'rent-50k-150k') {
      nextFilters.listingType = 'Rent';
      nextFilters.minRent = '50000';
      nextFilters.maxRent = '150000';
    } else if (heroBudget === 'lease-under-25l') {
      nextFilters.listingType = 'Lease';
      nextFilters.maxLease = '25';
    } else if (heroBudget === 'lease-25l-plus') {
      nextFilters.listingType = 'Lease';
      nextFilters.minLease = '25';
    }

    onApplySearch(nextFilters);
  };

  return (
    <div className="bg-white">
      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14 lg:pt-14 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Hero Copy Column */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <p className="text-sm font-medium text-[#7C3AED] mb-4">
              Chennai, Tamil Nadu · Rental &amp; Leasing Platform
            </p>
            <h1 className="font-display text-[clamp(2.4rem,4.4vw,3.9rem)] font-semibold tracking-tight text-[#222222] leading-[1.08] mb-5">
              Find Your Space. Make It Yours.
            </h1>
            <p className="text-base sm:text-lg text-[#555555] leading-relaxed max-w-xl mb-8">
              Spacupied connects property owners, landlords, landowners, tenants, and businesses
              across Chennai—bringing homes, residential plots, commercial suites, retail spaces,
              and agricultural land together in one serene, transparent marketplace.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={() => onNavigate('listings')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl transition-colors duration-200 cursor-pointer whitespace-nowrap shadow-xs"
              >
                <span>Explore Properties</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('list-property')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-[#7C3AED] bg-white border border-[#C4B5FD] hover:bg-[#FAF8FF] rounded-xl transition-colors duration-200 cursor-pointer whitespace-nowrap"
              >
                <span>List Your Property</span>
              </button>
            </div>
          </div>

          {/* Right Hero Media Column */}
          <div className="lg:col-span-6">
            <div className="relative w-full h-full min-h-[280px] sm:min-h-[360px] lg:min-h-[420px] rounded-3xl overflow-hidden border border-[#EDE9FE] bg-[#F7F5FF]">
              {!heroImageError ? (
                <img
                  src={IMG_HERO_RESIDENCE}
                  alt="Modern sunlit white concrete luxury residence in Chennai, Tamil Nadu"
                  referrerPolicy="no-referrer"
                  onError={() => setHeroImageError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
                  <Building2 className="w-10 h-10 text-[#7C3AED] mb-3" />
                  <p className="font-display text-xl text-[#222222]">Spacupied Chennai</p>
                  <p className="text-sm text-[#6B7280] mt-1">Residential, Commercial &amp; Land Leasing</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Full-Width Prominent Property Search Bar */}
        <form
          onSubmit={handleHeroSearch}
          aria-label="Property quick search"
          className="mt-10 bg-white rounded-2xl border border-[#DDD6FE] shadow-[0_8px_30px_rgba(124,58,237,0.07)] p-4 sm:p-5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
            <div className="lg:col-span-3">
              <label
                htmlFor="hero-locality"
                className="block text-xs font-semibold text-[#555555] mb-1.5"
              >
                Location in Chennai
              </label>
              <select
                id="hero-locality"
                value={heroLocality}
                onChange={(e) => setHeroLocality(e.target.value)}
                className="w-full h-11 rounded-xl border border-[#E5E7EB] bg-white px-3.5 text-sm text-[#222222] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#EDE9FE] outline-none"
              >
                <option value="All">All Chennai Localities</option>
                {CHENNAI_LOCALITIES.map((loc) => (
                  <option key={loc.name} value={loc.name}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-3">
              <label
                htmlFor="hero-category"
                className="block text-xs font-semibold text-[#555555] mb-1.5"
              >
                Property Category
              </label>
              <select
                id="hero-category"
                value={heroCategory}
                onChange={(e) => setHeroCategory(e.target.value as PropertyCategory | 'All')}
                className="w-full h-11 rounded-xl border border-[#E5E7EB] bg-white px-3.5 text-sm text-[#222222] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#EDE9FE] outline-none"
              >
                <option value="All">All Categories</option>
                {PROPERTY_CATEGORIES.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-2">
              <label
                htmlFor="hero-type"
                className="block text-xs font-semibold text-[#555555] mb-1.5"
              >
                Arrangement
              </label>
              <select
                id="hero-type"
                value={heroType}
                onChange={(e) => setHeroType(e.target.value as ListingType | 'All')}
                className="w-full h-11 rounded-xl border border-[#E5E7EB] bg-white px-3.5 text-sm text-[#222222] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#EDE9FE] outline-none"
              >
                <option value="All">Rent or Lease</option>
                <option value="Rent">Monthly Rent</option>
                <option value="Lease">Long-Term Lease</option>
              </select>
            </div>

            <div className="lg:col-span-2">
              <label
                htmlFor="hero-budget"
                className="block text-xs font-semibold text-[#555555] mb-1.5"
              >
                Budget Range
              </label>
              <select
                id="hero-budget"
                value={heroBudget}
                onChange={(e) => setHeroBudget(e.target.value)}
                className="w-full h-11 rounded-xl border border-[#E5E7EB] bg-white px-3.5 text-sm text-[#222222] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#EDE9FE] outline-none"
              >
                <option value="any">Any Budget</option>
                <option value="rent-under-50k">Rent under ₹50,000/mo</option>
                <option value="rent-50k-150k">Rent ₹50k – ₹1.5L/mo</option>
                <option value="lease-under-25l">Lease up to ₹25 Lakhs</option>
                <option value="lease-25l-plus">Lease ₹25 Lakhs+</option>
              </select>
            </div>

            <div className="lg:col-span-2">
              <button
                type="submit"
                className="w-full h-11 inline-flex items-center justify-center gap-2 px-5 text-sm font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl transition-colors duration-200 cursor-pointer whitespace-nowrap"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* PROPERTY CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-t border-[#F3F0FF]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-sm font-medium text-[#7C3AED] mb-2">Property Categories</p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#222222]">
              Spaces Tailored to Every Purpose
            </h2>
          </div>
          <p className="text-sm text-[#555555] max-w-md">
            From sunlit residential apartments and corner plots to commercial floor plates and
            fertile farmland across Chennai.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROPERTY_CATEGORIES.map((category) => {
            const count = properties.filter((p) => p.category === category.name).length;
            return (
              <button
                key={category.name}
                type="button"
                onClick={() =>
                  onApplySearch({
                    category: category.name,
                    locality: 'All',
                    listingType: 'All',
                  })
                }
                className="group text-left bg-white rounded-2xl border border-[#ECE8F8] hover:border-[#C4B5FD] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(124,58,237,0.08)] flex flex-col cursor-pointer"
              >
                <div className="aspect-[16/10] w-full rounded-xl overflow-hidden bg-[#F7F5FF] mb-4">
                  <img
                    src={category.image}
                    alt={category.name}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <h3 className="text-base font-semibold text-[#222222] group-hover:text-[#7C3AED] transition-colors">
                    {category.name}
                  </h3>
                  <ArrowUpRight className="w-4 h-4 text-[#7C3AED] shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                <p className="text-sm text-[#555555] leading-relaxed mb-3 flex-1">
                  {category.description}
                </p>
                <p className="text-xs font-medium text-[#7C3AED] tabular-nums">
                  {count} {count === 1 ? 'sample listing' : 'sample listings'} available
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* FEATURED PROPERTIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-t border-[#F3F0FF]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-sm font-medium text-[#7C3AED] mb-2">
              Featured Spaces · Illustrative Sample Catalogue
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#222222]">
              Curated Chennai Sample Listings
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('listings')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#7C3AED] hover:text-[#6D28D9] transition-colors cursor-pointer whitespace-nowrap"
          >
            <span>Explore All Properties</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
          {featuredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onSelect={onSelectProperty}
            />
          ))}
        </div>
      </section>

      {/* POPULAR CHENNAI LOCATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-t border-[#F3F0FF]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-sm font-medium text-[#7C3AED] mb-2">Chennai Neighborhoods</p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#222222]">
              Popular Locations Across Chennai
            </h2>
          </div>
          <p className="text-sm text-[#555555] max-w-md">
            Select a neighborhood to browse residential, commercial, and land leasing opportunities
            in that locality.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularLocations.map((loc) => {
            const locCount = properties.filter((p) => p.locality === loc.name).length;
            return (
              <button
                key={loc.name}
                type="button"
                onClick={() =>
                  onApplySearch({
                    locality: loc.name,
                    category: 'All',
                    listingType: 'All',
                  })
                }
                className="group text-left bg-white rounded-2xl border border-[#ECE8F8] hover:border-[#7C3AED] hover:bg-[#FAF8FF] p-5 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="inline-flex items-center gap-1.5 text-base font-semibold text-[#222222] group-hover:text-[#7C3AED] transition-colors">
                    <MapPin className="w-4 h-4 text-[#7C3AED] shrink-0" />
                    <span>{loc.name}</span>
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#7C3AED] shrink-0 transition-colors" />
                </div>
                <p className="text-xs font-medium text-[#7C3AED]/85 mb-1">{loc.zone}</p>
                <p className="text-sm text-[#555555] leading-snug mb-3">{loc.highlight}</p>
                <p className="text-xs text-[#6B7280] tabular-nums">
                  {locCount} {locCount === 1 ? 'listing' : 'listings'}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* OWNER & LANDOWNER CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8">
        <div className="rounded-3xl bg-[#FAF8FF] border border-[#DDD6FE] px-6 py-12 sm:px-12 sm:py-14 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-[#7C3AED] mb-2">
              For Property Owners, Landlords &amp; Landowners
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#222222] mb-3">
              Have a Property or Land Parcel in Chennai?
            </h2>
            <p className="text-base text-[#555555] leading-relaxed">
              Publish your residential home, plot, shop, commercial building, or agricultural land
              on Spacupied and connect directly with genuine tenants and leasing partners.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('list-property')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>List Your Property</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() =>
                onOpenWhatsApp(
                  'Hello Spacupied, I am a property owner in Chennai and would like to list a rental or lease property.'
                )
              }
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-semibold text-[#7C3AED] bg-white border border-[#C4B5FD] hover:bg-[#EDE9FE]/50 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Assistance</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
