import React, { useState } from 'react';
import { ArrowRight, Check, CheckCircle2, Upload } from 'lucide-react';
import {
  CHENNAI_LOCALITIES,
  COMMON_AMENITIES,
  formatIndianCurrency,
  IMG_AGRICULTURAL,
  IMG_APARTMENT,
  IMG_COMMERCIAL_TOWER,
  IMG_HERO_RESIDENCE,
  IMG_OFFICE_RETAIL,
  IMG_RESIDENTIAL_PLOT,
  PROPERTY_CATEGORIES,
} from '../data/sampleProperties';
import {
  AreaUnit,
  AvailabilityStatus,
  ListingType,
  Property,
  PropertyCategory,
} from '../types';

interface ListPropertyPageProps {
  onAddProperty: (property: Property) => void;
  onViewProperty: (id: string) => void;
}

const CATEGORY_DEFAULT_IMAGE: Record<PropertyCategory, string> = {
  'Houses & Apartments': IMG_APARTMENT,
  'Residential Land & Plots': IMG_RESIDENTIAL_PLOT,
  'Commercial Properties': IMG_COMMERCIAL_TOWER,
  'Shops & Office Spaces': IMG_OFFICE_RETAIL,
  'Agricultural Land': IMG_AGRICULTURAL,
  'Residential & Commercial Leasing': IMG_HERO_RESIDENCE,
};

export const ListPropertyPage: React.FC<ListPropertyPageProps> = ({
  onAddProperty,
  onViewProperty,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<PropertyCategory>('Houses & Apartments');
  const [listingType, setListingType] = useState<ListingType>('Rent');
  const [locality, setLocality] = useState(CHENNAI_LOCALITIES[0].name);
  const [priceInput, setPriceInput] = useState('');
  const [depositOrTenure, setDepositOrTenure] = useState('');
  const [areaValue, setAreaValue] = useState('');
  const [areaUnit, setAreaUnit] = useState<AreaUnit>('sq.ft');
  const [bedrooms, setBedrooms] = useState('3');
  const [bathrooms, setBathrooms] = useState('2');
  const [availability, setAvailability] = useState<AvailabilityStatus>('Immediate');
  const [facing, setFacing] = useState('East Facing');
  const [furnishingOrZoning, setFurnishingOrZoning] = useState('Semi-Furnished');
  const [description, setDescription] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'Covered Car Parking',
    '100% Power Backup',
  ]);
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [createdProperty, setCreatedProperty] = useState<Property | null>(null);

  const isResidential =
    category === 'Houses & Apartments' || category === 'Residential & Commercial Leasing';

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((item) => item !== amenity) : [...prev, amenity]
    );
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG, or WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setUploadedPreview(reader.result);
        setError('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const numericPrice = Number(priceInput);
    const numericArea = Number(areaValue);

    if (title.trim().length < 5) {
      setError('Please provide a clear property title (at least 5 characters).');
      return;
    }
    if (!numericPrice || numericPrice <= 0) {
      setError(
        listingType === 'Rent'
          ? 'Please enter a valid monthly rental amount in INR.'
          : 'Please enter a valid lease amount in INR.'
      );
      return;
    }
    if (!numericArea || numericArea <= 0) {
      setError('Please enter a valid property area size.');
      return;
    }
    if (description.trim().length < 20) {
      setError('Please write a brief property description (at least 20 characters).');
      return;
    }
    if (!ownerName.trim()) {
      setError('Please enter your name as the property owner or representative.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ownerEmail.trim())) {
      setError('Please enter a valid contact email address.');
      return;
    }

    const locData =
      CHENNAI_LOCALITIES.find((l) => l.name === locality) || CHENNAI_LOCALITIES[0];

    const areaSqFt =
      areaUnit === 'acres'
        ? Math.round(numericArea * 43560)
        : areaUnit === 'grounds'
        ? Math.round(numericArea * 2400)
        : Math.round(numericArea);

    const areaDisplay =
      areaUnit === 'sq.ft'
        ? `${numericArea.toLocaleString('en-IN')} sq.ft`
        : `${numericArea} ${areaUnit === 'grounds' ? (numericArea === 1 ? 'Ground' : 'Grounds') : numericArea === 1 ? 'Acre' : 'Acres'}`;

    const newProp: Property = {
      id: `owner-${Date.now()}`,
      title: title.trim(),
      category,
      listingType,
      locality,
      city: 'Chennai, Tamil Nadu',
      price: numericPrice,
      priceLabel: formatIndianCurrency(numericPrice, listingType),
      depositOrTenure:
        depositOrTenure.trim() ||
        (listingType === 'Rent'
          ? 'Standard Chennai rental deposit & 11-month agreement'
          : 'Structured multi-year lease agreement'),
      areaSqFt,
      areaDisplay,
      areaUnit,
      bedrooms: isResidential && bedrooms !== 'none' ? Number(bedrooms) : undefined,
      bathrooms: isResidential && bathrooms !== 'none' ? Number(bathrooms) : undefined,
      availability,
      facing,
      furnishingOrZoning: furnishingOrZoning.trim() || category,
      shortDescription:
        description.trim().length > 130
          ? `${description.trim().slice(0, 127)}...`
          : description.trim(),
      description: description.trim(),
      amenities:
        selectedAmenities.length > 0 ? selectedAmenities : ['Direct Owner Listing'],
      images: [uploadedPreview || CATEGORY_DEFAULT_IMAGE[category]],
      coordinates: { lat: locData.lat, lng: locData.lng },
      featured: true,
      isSample: false,
      createdAt: new Date().toISOString().split('T')[0],
    };

    onAddProperty(newProp);
    setCreatedProperty(newProp);
  };

  if (createdProperty) {
    return (
      <div className="bg-white py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <div className="rounded-3xl border border-[#DDD6FE] bg-[#FAF8FF] p-8 sm:p-12 space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <p className="text-sm font-medium text-[#7C3AED]">Submission Published</p>
            <h1 className="font-display text-3xl font-semibold text-[#222222]">
              Your Property Is Now Live on Spacupied
            </h1>
            <p className="text-sm sm:text-base text-[#555555] leading-relaxed">
              <span className="font-semibold text-[#222222]">{createdProperty.title}</span> in{' '}
              {createdProperty.locality}, Chennai ({createdProperty.priceLabel}) has been added to
              the live Spacupied listings directory.
            </p>
            <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => onViewProperty(createdProperty.id)}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>View Your Listing</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setCreatedProperty(null);
                  setTitle('');
                  setPriceInput('');
                  setAreaValue('');
                  setDescription('');
                  setUploadedPreview(null);
                }}
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-[#7C3AED] bg-white border border-[#C4B5FD] hover:bg-[#EDE9FE]/50 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>Submit Another Property</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="border-b border-[#F3F0FF]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-sm font-medium text-[#7C3AED] mb-2">
            Property Owners · Landlords · Landowners
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#222222] mb-3">
            List Your Property in Chennai
          </h1>
          <p className="text-base text-[#555555] max-w-2xl leading-relaxed">
            Share your residential home, land plot, commercial space, retail storefront, or
            agricultural estate for rent or lease. Your privacy is protected—phone numbers are
            never displayed publicly.
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <form onSubmit={handleSubmit} className="space-y-10" noValidate>
          {/* Section 1: Basic Details */}
          <section className="space-y-5 pb-8 border-b border-[#F3F0FF]">
            <h2 className="text-lg font-semibold text-[#222222]">01. Property Basics</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label
                  htmlFor="prop-title"
                  className="block text-xs font-semibold text-[#555555] mb-1.5"
                >
                  Property Title *
                </label>
                <input
                  id="prop-title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Bright 3 BHK Independent Floor in Adyar"
                  className="w-full h-11 rounded-xl border border-[#E5E7EB] px-4 text-sm text-[#222222] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#EDE9FE] outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="prop-category"
                  className="block text-xs font-semibold text-[#555555] mb-1.5"
                >
                  Property Category *
                </label>
                <select
                  id="prop-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as PropertyCategory)}
                  className="w-full h-11 rounded-xl border border-[#E5E7EB] bg-white px-3.5 text-sm text-[#222222] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#EDE9FE] outline-none"
                >
                  {PROPERTY_CATEGORIES.map((cat) => (
                    <option key={cat.name} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <span className="block text-xs font-semibold text-[#555555] mb-1.5">
                  Listing Type *
                </span>
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#F5F3FF] rounded-xl h-11">
                  {(['Rent', 'Lease'] as ListingType[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setListingType(t)}
                      className={`text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                        listingType === t
                          ? 'bg-white text-[#7C3AED] shadow-xs'
                          : 'text-[#555555] hover:text-[#222222]'
                      }`}
                    >
                      For {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="prop-locality"
                  className="block text-xs font-semibold text-[#555555] mb-1.5"
                >
                  Chennai Locality *
                </label>
                <select
                  id="prop-locality"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  className="w-full h-11 rounded-xl border border-[#E5E7EB] bg-white px-3.5 text-sm text-[#222222] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#EDE9FE] outline-none"
                >
                  {CHENNAI_LOCALITIES.map((loc) => (
                    <option key={loc.name} value={loc.name}>
                      {loc.name} ({loc.zone})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="prop-availability"
                  className="block text-xs font-semibold text-[#555555] mb-1.5"
                >
                  Availability *
                </label>
                <select
                  id="prop-availability"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value as AvailabilityStatus)}
                  className="w-full h-11 rounded-xl border border-[#E5E7EB] bg-white px-3.5 text-sm text-[#222222] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#EDE9FE] outline-none"
                >
                  <option value="Immediate">Immediate</option>
                  <option value="Ready to Move">Ready to Move</option>
                  <option value="Within 30 Days">Within 30 Days</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>
            </div>
          </section>

          {/* Section 2: Pricing & Dimensions */}
          <section className="space-y-5 pb-8 border-b border-[#F3F0FF]">
            <h2 className="text-lg font-semibold text-[#222222]">02. Pricing &amp; Specifications</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="prop-price"
                  className="block text-xs font-semibold text-[#555555] mb-1.5"
                >
                  {listingType === 'Rent'
                    ? 'Monthly Rental Price (INR ₹) *'
                    : 'Total Lease Price (INR ₹) *'}
                </label>
                <input
                  id="prop-price"
                  type="number"
                  min="1"
                  required
                  value={priceInput}
                  onChange={(e) => setPriceInput(e.target.value)}
                  placeholder={listingType === 'Rent' ? 'e.g. 55000' : 'e.g. 2500000'}
                  className="w-full h-11 rounded-xl border border-[#E5E7EB] px-4 text-sm text-[#222222] tabular-nums focus:border-[#7C3AED] focus:ring-2 focus:ring-[#EDE9FE] outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="prop-terms"
                  className="block text-xs font-semibold text-[#555555] mb-1.5"
                >
                  Deposit / Lease Tenure Notes
                </label>
                <input
                  id="prop-terms"
                  type="text"
                  value={depositOrTenure}
                  onChange={(e) => setDepositOrTenure(e.target.value)}
                  placeholder={
                    listingType === 'Rent'
                      ? 'e.g. 6 months deposit · 11-month agreement'
                      : 'e.g. 3-year lease · Renewable terms'
                  }
                  className="w-full h-11 rounded-xl border border-[#E5E7EB] px-4 text-sm text-[#222222] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#EDE9FE] outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="prop-area"
                  className="block text-xs font-semibold text-[#555555] mb-1.5"
                >
                  Property Area *
                </label>
                <div className="flex gap-2">
                  <input
                    id="prop-area"
                    type="number"
                    min="1"
                    step="any"
                    required
                    value={areaValue}
                    onChange={(e) => setAreaValue(e.target.value)}
                    placeholder="e.g. 1800"
                    className="flex-1 h-11 rounded-xl border border-[#E5E7EB] px-4 text-sm text-[#222222] tabular-nums focus:border-[#7C3AED] focus:ring-2 focus:ring-[#EDE9FE] outline-none"
                  />
                  <select
                    aria-label="Area unit"
                    value={areaUnit}
                    onChange={(e) => setAreaUnit(e.target.value as AreaUnit)}
                    className="w-28 h-11 rounded-xl border border-[#E5E7EB] bg-white px-3 text-sm text-[#222222] focus:border-[#7C3AED] outline-none"
                  >
                    <option value="sq.ft">sq.ft</option>
                    <option value="grounds">Grounds</option>
                    <option value="acres">Acres</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="prop-facing"
                  className="block text-xs font-semibold text-[#555555] mb-1.5"
                >
                  Facing / Orientation
                </label>
                <select
                  id="prop-facing"
                  value={facing}
                  onChange={(e) => setFacing(e.target.value)}
                  className="w-full h-11 rounded-xl border border-[#E5E7EB] bg-white px-3.5 text-sm text-[#222222] focus:border-[#7C3AED] outline-none"
                >
                  <option value="East Facing">East Facing</option>
                  <option value="North Facing">North Facing</option>
                  <option value="North-East Facing">North-East Facing</option>
                  <option value="West Facing">West Facing</option>
                  <option value="South Facing">South Facing</option>
                  <option value="Corner / Dual Road">Corner / Dual Road</option>
                </select>
              </div>

              {isResidential && (
                <>
                  <div>
                    <label
                      htmlFor="prop-bedrooms"
                      className="block text-xs font-semibold text-[#555555] mb-1.5"
                    >
                      Bedrooms
                    </label>
                    <select
                      id="prop-bedrooms"
                      value={bedrooms}
                      onChange={(e) => setBedrooms(e.target.value)}
                      className="w-full h-11 rounded-xl border border-[#E5E7EB] bg-white px-3.5 text-sm text-[#222222] focus:border-[#7C3AED] outline-none"
                    >
                      <option value="1">1 BHK</option>
                      <option value="2">2 BHK</option>
                      <option value="3">3 BHK</option>
                      <option value="4">4 BHK</option>
                      <option value="5">5+ BHK</option>
                      <option value="none">Not Applicable</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="prop-bathrooms"
                      className="block text-xs font-semibold text-[#555555] mb-1.5"
                    >
                      Bathrooms
                    </label>
                    <select
                      id="prop-bathrooms"
                      value={bathrooms}
                      onChange={(e) => setBathrooms(e.target.value)}
                      className="w-full h-11 rounded-xl border border-[#E5E7EB] bg-white px-3.5 text-sm text-[#222222] focus:border-[#7C3AED] outline-none"
                    >
                      <option value="1">1 Bathroom</option>
                      <option value="2">2 Bathrooms</option>
                      <option value="3">3 Bathrooms</option>
                      <option value="4">4+ Bathrooms</option>
                      <option value="none">Not Applicable</option>
                    </select>
                  </div>
                </>
              )}

              <div className="sm:col-span-2">
                <label
                  htmlFor="prop-zoning"
                  className="block text-xs font-semibold text-[#555555] mb-1.5"
                >
                  Furnishing / Land Classification
                </label>
                <input
                  id="prop-zoning"
                  type="text"
                  value={furnishingOrZoning}
                  onChange={(e) => setFurnishingOrZoning(e.target.value)}
                  placeholder="e.g. Semi-Furnished Residential, Warm Shell Commercial, Irrigated Farmland"
                  className="w-full h-11 rounded-xl border border-[#E5E7EB] px-4 text-sm text-[#222222] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#EDE9FE] outline-none"
                />
              </div>
            </div>
          </section>

          {/* Section 3: Description, Amenities & Photo */}
          <section className="space-y-5 pb-8 border-b border-[#F3F0FF]">
            <h2 className="text-lg font-semibold text-[#222222]">
              03. Description, Amenities &amp; Photograph
            </h2>

            <div>
              <label
                htmlFor="prop-description"
                className="block text-xs font-semibold text-[#555555] mb-1.5"
              >
                Detailed Description *
              </label>
              <textarea
                id="prop-description"
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe natural lighting, neighborhood connectivity, road access, water availability, and ideal tenant or business profile..."
                className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm text-[#222222] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#EDE9FE] outline-none"
              />
            </div>

            <div>
              <span className="block text-xs font-semibold text-[#555555] mb-2.5">
                Select Key Amenities
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {COMMON_AMENITIES.map((amenity) => {
                  const checked = selectedAmenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-left text-xs font-medium transition-colors cursor-pointer ${
                        checked
                          ? 'border-[#7C3AED] bg-[#FAF8FF] text-[#7C3AED]'
                          : 'border-[#E5E7EB] bg-white text-[#444444] hover:border-[#C4B5FD]'
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                          checked
                            ? 'bg-[#7C3AED] text-white'
                            : 'border border-[#D1D5DB] bg-white'
                        }`}
                      >
                        {checked && <Check className="w-3 h-3" />}
                      </span>
                      <span className="truncate">{amenity}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <span className="block text-xs font-semibold text-[#555555] mb-2">
                Property Photograph (Optional)
              </span>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <label className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#7C3AED] bg-[#FAF8FF] hover:bg-[#EDE9FE] border border-[#DDD6FE] rounded-xl transition-colors cursor-pointer">
                  <Upload className="w-4 h-4" />
                  <span>Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="sr-only"
                  />
                </label>
                <span className="text-xs text-[#6B7280]">
                  {uploadedPreview
                    ? 'Custom photo selected.'
                    : 'If omitted, a clean category architectural image will be used.'}
                </span>
              </div>
              {uploadedPreview && (
                <div className="mt-3 w-48 aspect-[4/3] rounded-xl overflow-hidden border border-[#EDE9FE]">
                  <img
                    src={uploadedPreview}
                    alt="Uploaded property preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </section>

          {/* Section 4: Owner Contact Email (No Public Phone Numbers) */}
          <section className="space-y-5">
            <h2 className="text-lg font-semibold text-[#222222]">
              04. Owner / Representative Details
            </h2>
            <p className="text-xs text-[#6B7280]">
              Used strictly for private enquiry routing. Spacupied never displays personal phone
              numbers on public listings.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="owner-name"
                  className="block text-xs font-semibold text-[#555555] mb-1.5"
                >
                  Full Name *
                </label>
                <input
                  id="owner-name"
                  type="text"
                  required
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="Property owner or representative name"
                  className="w-full h-11 rounded-xl border border-[#E5E7EB] px-4 text-sm text-[#222222] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#EDE9FE] outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="owner-email"
                  className="block text-xs font-semibold text-[#555555] mb-1.5"
                >
                  Email Address *
                </label>
                <input
                  id="owner-email"
                  type="email"
                  required
                  value={ownerEmail}
                  onChange={(e) => setOwnerEmail(e.target.value)}
                  placeholder="owner@example.com"
                  className="w-full h-11 rounded-xl border border-[#E5E7EB] px-4 text-sm text-[#222222] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#EDE9FE] outline-none"
                />
              </div>
            </div>
          </section>

          {error && (
            <p
              role="alert"
              className="text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3"
            >
              {error}
            </p>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>Publish Property Listing</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
