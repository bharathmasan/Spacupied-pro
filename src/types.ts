export type PropertyCategory =
  | 'Houses & Apartments'
  | 'Residential Land & Plots'
  | 'Commercial Properties'
  | 'Shops & Office Spaces'
  | 'Agricultural Land'
  | 'Residential & Commercial Leasing';

export type ListingType = 'Rent' | 'Lease';

export type AvailabilityStatus =
  | 'Immediate'
  | 'Within 30 Days'
  | 'Ready to Move'
  | 'Flexible';

export type AreaUnit = 'sq.ft' | 'grounds' | 'acres';

export type PageRoute =
  | 'home'
  | 'listings'
  | 'property-detail'
  | 'list-property'
  | 'about'
  | 'contact'
  | 'faqs'
  | 'privacy';

export interface Property {
  id: string;
  title: string;
  category: PropertyCategory;
  listingType: ListingType;
  locality: string;
  city: string;
  /** Monthly rent in INR (if listingType === 'Rent') or total lease amount in INR (if listingType === 'Lease') */
  price: number;
  priceLabel: string;
  depositOrTenure: string;
  areaSqFt: number;
  areaDisplay: string;
  areaUnit: AreaUnit;
  bedrooms?: number;
  bathrooms?: number;
  availability: AvailabilityStatus;
  facing?: string;
  furnishingOrZoning: string;
  shortDescription: string;
  description: string;
  amenities: string[];
  images: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  featured: boolean;
  isSample: boolean;
  createdAt: string;
}

export interface SearchFilters {
  query: string;
  locality: string;
  category: PropertyCategory | 'All';
  listingType: ListingType | 'All';
  minRent: string;
  maxRent: string;
  minLease: string;
  maxLease: string;
  minArea: string;
  maxArea: string;
  bedrooms: string;
  availability: AvailabilityStatus | 'All';
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'area-desc';
}

export interface EnquiryRecord {
  id: string;
  propertyId?: string;
  propertyTitle?: string;
  name: string;
  email: string;
  intent: string;
  message: string;
  submittedAt: string;
}
