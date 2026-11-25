import React, { useMemo, useState } from 'react';
import {
  LayoutGrid,
  Map as MapIcon,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import {
  CHENNAI_LOCALITIES,
  PROPERTY_CATEGORIES,
} from '../data/sampleProperties';
import {
  AvailabilityStatus,
  ListingType,
  Property,
  PropertyCategory,
  SearchFilters,
} from '../types';
import { PropertyCard } from '../components/PropertyCard';
import { PropertyMap } from '../components/PropertyMap';

interface ListingsPageProps {
  properties: Property[];
  filters: SearchFilters;
  onUpdateFilters: (next: Partial<SearchFilters>) => void;
  onResetFilters: () => void;
  onSelectProperty: (id: string) => void;
  hasMapsApiKey: boolean;
}

const AVAILABILITY_OPTIONS: (AvailabilityStatus | 'All')[] = [
  'All',
  'Immediate',
  'Ready to Move',
  'Within 30 Days',
  'Flexible',
];

export const ListingsPage: React.FC<ListingsPageProps> = ({
  properties,
  filters,
  onUpdateFilters,
  onResetFilters,
  onSelectProperty,
  hasMapsApiKey,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const filteredProperties = useMemo(() => {
    const queryLower = filters.query.trim().toLowerCase();
    const minRent = filters.minRent ? Number(filters.minRent) : null;
    const maxRent = filters.maxRent ? Number(filters.maxRent) : null;
    const minLease = filters.minLease ? Number(filters.minLease) * 100000 : null;
    const maxLease = filters.maxLease ? Number(filters.maxLease) * 100000 : null;
    const minArea = filters.minArea ? Number(filters.minArea) : null;
    const maxArea = filters.maxArea ? Number(filters.maxArea) : null;

    const list = properties.filter((prop) => {
      if (queryLower) {
        const haystack =
          `${prop.title} ${prop.locality} ${prop.category} ${prop.shortDescription} ${prop.furnishingOrZoning}`.toLowerCase();
        if (!haystack.includes(queryLower)) return false;
      }

      if (filters.locality !== 'All' && prop.locality !== filters.locality) {
        return false;
      }

      if (filters.category !== 'All' && prop.category !== filters.category) {
        return false;
      }

      if (filters.listingType !== 'All' && prop.listingType !== filters.listingType) {
        return false;
      }

      // Rental price filter (monthly INR)
      if (minRent !== null || maxRent !== null) {
        if (prop.listingType !== 'Rent') return false;
        if (minRent !== null && prop.price < minRent) return false;
        if (maxRent !== null && prop.price > maxRent) return false;
      }

      // Lease price filter (INR Lakhs converted to INR)
      if (minLease !== null || maxLease !== null) {
        if (prop.listingType !== 'Lease') return false;
        if (minLease !== null && prop.price < minLease) return false;
        if (maxLease !== null && prop.price > maxLease) return false;
      }

      // Property size (sq.ft)
      if (minArea !== null && prop.areaSqFt < minArea) return false;
      if (maxArea !== null && prop.areaSqFt > maxArea) return false;

      // Bedrooms
      if (filters.bedrooms !== 'All') {
        if (filters.bedrooms === 'none') {
          if (prop.bedrooms !== undefined && prop.bedrooms > 0) return false;
        } else if (filters.bedrooms === '4+') {
          if (!prop.bedrooms || prop.bedrooms < 4) return false;
        } else {
          const targetBeds = Number(filters.bedrooms);
          if (prop.bedrooms !== targetBeds) return false;
        }
      }

      // Availability
      if (filters.availability !== 'All' && prop.availability !== filters.availability) {
        return false;
      }

      return true;
    });

    const sorted = [...list];
    if (filters.sortBy === 'price-asc') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'price-desc') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === 'area-desc') {
      sorted.sort((a, b) => b.areaSqFt - a.areaSqFt);
    } else {
      sorted.sort((a, b) => Number(b.featured) - Number(a.featured));
    }

    return sorted;
  }, [properties, filters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.query.trim()) count++;
    if (filters.locality !== 'All') count++;
    if (filters.category !== 'All') count++;
    if (filters.listingType !== 'All') count++;
    if (filters.minRent || filters.maxRent) count++;
    if (filters.minLease || filters.maxLease) count++;
    if (filters.minArea || filters.maxArea) count++;
    if (filters.bedrooms !== 'All') count++;
    if (filters.availability !== 'All') count++;
    return count;
  }, [filters]);

  const filterForm = (
    <div className="space-y-5">
      {/* Keyword Search */}
      <div>
        <label htmlFor="filter-query" className="block text-xs font-semibold text-[#555555] mb-1.5">
          Search Keyword
        </label>
        <div className="relative">
          <Search className="w-4 h-4 text-[#7C3AED] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="filter-query"
            type="text"
            value={filters.query}
            onChange={(e) => onUpdateFilters({ query: e.target.value })}
            placeholder="e.g. Adyar, villa, showroom, plot..."
            className="w-full h-10 pl-10 pr-3.5 rounded-xl border border-[#E5E7EB] bg-white text-sm text-[#222222] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#EDE9FE] outline-none"
          />
        </div>
      </div>

      {/* Listing Type Segmented Control */}
      <div>
        <span className="block text-xs font-semibold text-[#555555] mb-1.5">
          Arrangement Type
        </span>
        <div className="grid grid-cols-3 gap-1 p-1 bg-[#F5F3FF] rounded-xl">
          {(['All', 'Rent', 'Lease'] as (ListingType | 'All')[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => onUpdateFilters({ listingType: type })}
              className={`py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                filters.listingType === type
                  ? 'bg-white text-[#7C3AED] shadow-xs'
                  : 'text-[#555555] hover:text-[#222222]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Location */}
      <div>
        <label
          htmlFor="filter-locality"
          className="block text-xs font-semibold text-[#555555] mb-1.5"
        >
          Chennai Locality
        </label>
        <select
          id="filter-locality"
          value={filters.locality}
          onChange={(e) => onUpdateFilters({ locality: e.target.value })}
          className="w-full h-10 rounded-xl border border-[#E5E7EB] bg-white px-3 text-sm text-[#222222] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#EDE9FE] outline-none"
        >
          <option value="All">All Chennai Localities</option>
          {CHENNAI_LOCALITIES.map((loc) => (
            <option key={loc.name} value={loc.name}>
              {loc.name}
            </option>
          ))}
        </select>
      </div>

      {/* Property Category */}
      <div>
        <label
          htmlFor="filter-category"
          className="block text-xs font-semibold text-[#555555] mb-1.5"
        >
          Property Category
        </label>
        <select
          id="filter-category"
          value={filters.category}
          onChange={(e) => onUpdateFilters({ category: e.target.value as PropertyCategory | 'All' })}
          className="w-full h-10 rounded-xl border border-[#E5E7EB] bg-white px-3 text-sm text-[#222222] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#EDE9FE] outline-none"
        >
          <option value="All">All Categories</option>
          {PROPERTY_CATEGORIES.map((cat) => (
            <option key={cat.name} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Rental Budget Range (₹/month) */}
      <div>
        <span className="block text-xs font-semibold text-[#555555] mb-1.5">
          Monthly Rental Price (₹ / month)
        </span>
        <div className="grid grid-cols-2 gap-2.5">
          <input
            type="number"
            min="0"
            step="5000"
            value={filters.minRent}
            onChange={(e) => onUpdateFilters({ minRent: e.target.value })}
            placeholder="Min ₹"
            aria-label="Minimum monthly rent in INR"
            className="w-full h-10 rounded-xl border border-[#E5E7EB] bg-white px-3 text-sm text-[#222222] tabular-nums focus:border-[#7C3AED] focus:ring-2 focus:ring-[#EDE9FE] outline-none"
          />
          <input
            type="number"
            min="0"
            step="5000"
            value={filters.maxRent}
            onChange={(e) => onUpdateFilters({ maxRent: e.target.value })}
            placeholder="Max ₹"
            aria-label="Maximum monthly rent in INR"
            className="w-full h-10 rounded-xl border border-[#E5E7EB] bg-white px-3 text-sm text-[#222222] tabular-nums focus:border-[#7C3AED] focus:ring-2 focus:ring-[#EDE9FE] outline-none"
          />
        </div>
      </div>

      {/* Lease Price Range (₹ Lakhs) */}
      <div>
        <span className="block text-xs font-semibold text-[#555555] mb-1.5">
          Lease Price Range (₹ Lakhs)
        </span>
        <div className="grid grid-cols-2 gap-2.5">
          <input
            type="number"
            min="0"
            step="5"
            value={filters.minLease}
            onChange={(e) => onUpdateFilters({ minLease: e.target.value })}
            placeholder="Min Lakhs"
            aria-label="Minimum lease amount in Lakhs"
            className="w-full h-10 rounded-xl border border-[#E5E7EB] bg-white px-3 text-sm text-[#222222] tabular-nums focus:border-[#7C3AED] focus:ring-2 focus:ring-[#EDE9FE] outline-none"
          />
          <input
            type="number"
            min="0"
            step="5"
            value={filters.maxLease}
            onChange={(e) => onUpdateFilters({ maxLease: e.target.value })}
            placeholder="Max Lakhs"
            aria-label="Maximum lease amount in Lakhs"
            className="w-full h-10 rounded-xl border border-[#E5E7EB] bg-white px-3 text-sm text-[#222222] tabular-nums focus:border-[#7C3AED] focus:ring-2 focus:ring-[#EDE9FE] outline-none"
          />
        </div>
      </div>

      {/* Property Size (Sq. Ft.) */}
      <div>
        <span className="block text-xs font-semibold text-[#555555] mb-1.5">
          Property Size (sq.ft)
        </span>
        <div className="grid grid-cols-2 gap-2.5">
          <input
            type="number"
            min="0"
            step="250"
            value={filters.minArea}
            onChange={(e) => onUpdateFilters({ minArea: e.target.value })}
            placeholder="Min sq.ft"
            aria-label="Minimum property area in square feet"
            className="w-full h-10 rounded-xl border border-[#E5E7EB] bg-white px-3 text-sm text-[#222222] tabular-nums focus:border-[#7C3AED] focus:ring-2 focus:ring-[#EDE9FE] outline-none"
          />
          <input
            type="number"
            min="0"
            step="250"
            value={filters.maxArea}
            onChange={(e) => onUpdateFilters({ maxArea: e.target.value })}
            placeholder="Max sq.ft"
            aria-label="Maximum property area in square feet"
            className="w-full h-10 rounded-xl border border-[#E5E7EB] bg-white px-3 text-sm text-[#222222] tabular-nums focus:border-[#7C3AED] focus:ring-2 focus:ring-[#EDE9FE] outline-none"
          />
        </div>
      </div>

      {/* Bedrooms */}
      <div>
        <label
          htmlFor="filter-bedrooms"
          className="block text-xs font-semibold text-[#555555] mb-1.5"
        >
          Bedrooms / Configuration
        </label>
        <select
          id="filter-bedrooms"
          value={filters.bedrooms}
          onChange={(e) => onUpdateFilters({ bedrooms: e.target.value })}
          className="w-full h-10 rounded-xl border border-[#E5E7EB] bg-white px-3 text-sm text-[#222222] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#EDE9FE] outline-none"
        >
          <option value="All">Any Configuration</option>
          <option value="1">1 BHK</option>
          <option value="2">2 BHK</option>
          <option value="3">3 BHK</option>
          <option value="4+">4+ BHK</option>
          <option value="none">Commercial / Plot / Land</option>
        </select>
      </div>

      {/* Availability */}
      <div>
        <label
          htmlFor="filter-availability"
          className="block text-xs font-semibold text-[#555555] mb-1.5"
        >
          Availability
        </label>
        <select
          id="filter-availability"
          value={filters.availability}
          onChange={(e) =>
            onUpdateFilters({ availability: e.target.value as AvailabilityStatus | 'All' })
          }
          className="w-full h-10 rounded-xl border border-[#E5E7EB] bg-white px-3 text-sm text-[#222222] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#EDE9FE] outline-none"
        >
          {AVAILABILITY_OPTIONS.map((avail) => (
            <option key={avail} value={avail}>
              {avail === 'All' ? 'Any Availability' : avail}
            </option>
          ))}
        </select>
      </div>

      {activeFilterCount > 0 && (
        <button
          type="button"
          onClick={onResetFilters}
          className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-[#7C3AED] bg-[#FAF8FF] hover:bg-[#EDE9FE] border border-[#DDD6FE] rounded-xl transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Filters ({activeFilterCount})</span>
        </button>
      )}
    </div>
  );

  return (
    <div className="bg-white min-h-[70vh]">
      {/* Page Header */}
      <div className="border-b border-[#F3F0FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-sm font-medium text-[#7C3AED] mb-2">
            Chennai Rental &amp; Leasing Directory
          </p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#222222]">
                Explore Properties in Chennai
              </h1>
              <p className="text-sm text-[#555555] mt-2 max-w-2xl">
                Filter across homes, plots, commercial buildings, retail spaces, and agricultural
                land. Listings marked Sample Listing are illustrative examples; submitted properties
                appear immediately as Owner Listings.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar: Mobile Filter Toggle + Result Count + Sort + View Mode */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-[#F3F0FF]">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowMobileFilters((prev) => !prev)}
              className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#7C3AED] bg-[#FAF8FF] border border-[#DDD6FE] rounded-xl cursor-pointer whitespace-nowrap"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}</span>
            </button>
            <p className="text-sm text-[#555555] tabular-nums">
              Showing <span className="font-semibold text-[#222222]">{filteredProperties.length}</span>{' '}
              {filteredProperties.length === 1 ? 'property' : 'properties'}
              {filters.locality !== 'All' ? ` in ${filters.locality}` : ' across Chennai'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label htmlFor="sort-by" className="sr-only">
              Sort listings
            </label>
            <select
              id="sort-by"
              value={filters.sortBy}
              onChange={(e) =>
                onUpdateFilters({ sortBy: e.target.value as SearchFilters['sortBy'] })
              }
              className="h-10 rounded-xl border border-[#E5E7EB] bg-white px-3 text-sm text-[#222222] focus:border-[#7C3AED] outline-none"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="area-desc">Size: Largest First</option>
            </select>

            <div className="inline-flex items-center p-1 bg-[#F5F3FF] rounded-xl">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  viewMode === 'grid'
                    ? 'bg-white text-[#7C3AED] shadow-xs'
                    : 'text-[#555555] hover:text-[#222222]'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Grid</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('map')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  viewMode === 'map'
                    ? 'bg-white text-[#7C3AED] shadow-xs'
                    : 'text-[#555555] hover:text-[#222222]'
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>Map</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Filter Drawer */}
        {showMobileFilters && (
          <div className="lg:hidden mb-8 p-5 rounded-2xl border border-[#DDD6FE] bg-white">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#F3F0FF]">
              <h2 className="text-base font-semibold text-[#222222]">Filter Properties</h2>
              <button
                type="button"
                onClick={() => setShowMobileFilters(false)}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-[#555555] hover:bg-[#F5F3FF] cursor-pointer"
                aria-label="Close filters"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {filterForm}
          </div>
        )}

        {/* Desktop Sidebar + Results Grid / Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-24 bg-white rounded-2xl border border-[#ECE8F8] p-5">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#F3F0FF]">
              <h2 className="text-sm font-semibold text-[#222222]">Filter Properties</h2>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={onResetFilters}
                  className="text-xs font-semibold text-[#7C3AED] hover:text-[#6D28D9] cursor-pointer"
                >
                  Clear all
                </button>
              )}
            </div>
            {filterForm}
          </aside>

          {/* Results Area */}
          <div className="lg:col-span-9">
            {filteredProperties.length === 0 ? (
              <div className="rounded-2xl border border-[#EDE9FE] bg-[#FAF8FF] p-12 text-center">
                <p className="font-display text-2xl font-semibold text-[#222222] mb-2">
                  No Matching Properties Found
                </p>
                <p className="text-sm text-[#555555] max-w-md mx-auto mb-6">
                  Try widening your rental or lease budget, selecting another Chennai locality, or
                  clearing one of your active filters.
                </p>
                <button
                  type="button"
                  onClick={onResetFilters}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset Filters</span>
                </button>
              </div>
            ) : viewMode === 'map' ? (
              <div className="space-y-6">
                <PropertyMap
                  properties={filteredProperties}
                  onViewProperty={onSelectProperty}
                  heightClass="h-[520px]"
                  zoom={11}
                  hasApiKey={hasMapsApiKey}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredProperties.map((property) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      onSelect={onSelectProperty}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onSelect={onSelectProperty}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
