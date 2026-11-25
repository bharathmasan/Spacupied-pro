import React, { useState } from 'react';
import {
  ArrowLeft,
  Building2,
  Check,
  CheckCircle2,
  MapPin,
  MessageCircle,
  Send,
} from 'lucide-react';
import { EnquiryRecord, Property } from '../types';
import { PropertyMap } from '../components/PropertyMap';

interface PropertyDetailPageProps {
  property: Property;
  onBack: () => void;
  onSubmitEnquiry: (enquiry: Omit<EnquiryRecord, 'id' | 'submittedAt'>) => EnquiryRecord;
  onOpenWhatsApp: (contextText?: string) => void;
  hasMapsApiKey: boolean;
}

export const PropertyDetailPage: React.FC<PropertyDetailPageProps> = ({
  property,
  onBack,
  onSubmitEnquiry,
  onOpenWhatsApp,
  hasMapsApiKey,
}) => {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [imageError, setImageError] = useState(false);

  // Enquiry Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [intent, setIntent] = useState(
    property.listingType === 'Rent' ? 'Schedule a property viewing' : 'Request lease terms & viewing'
  );
  const [message, setMessage] = useState(
    `Hello, I am interested in "${property.title}" in ${property.locality}, Chennai. Please share availability and next steps.`
  );
  const [formError, setFormError] = useState('');
  const [submittedRecord, setSubmittedRecord] = useState<EnquiryRecord | null>(null);

  const currentImg = property.images[activeImageIdx] || property.images[0];

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setFormError('Please enter a valid email address.');
      return;
    }
    if (message.trim().length < 10) {
      setFormError('Please include a brief enquiry message (at least 10 characters).');
      return;
    }

    const record = onSubmitEnquiry({
      propertyId: property.id,
      propertyTitle: property.title,
      name: name.trim(),
      email: email.trim(),
      intent,
      message: message.trim(),
    });

    setSubmittedRecord(record);
  };

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Back Breadcrumb */}
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#555555] hover:text-[#7C3AED] transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Property Listings</span>
        </button>

        {/* Two-Column Detail Architecture */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Main Content (8 cols) */}
          <div className="lg:col-span-8 space-y-10">
            {/* Photo Gallery */}
            <div className="space-y-3">
              <div className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden border border-[#EDE9FE] bg-[#F7F5FF]">
                {!imageError && currentImg ? (
                  <img
                    src={currentImg}
                    alt={`${property.title} — ${property.locality}, Chennai`}
                    referrerPolicy="no-referrer"
                    onError={() => setImageError(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
                    <Building2 className="w-10 h-10 text-[#7C3AED] mb-3" />
                    <p className="font-display text-xl text-[#222222]">{property.title}</p>
                    <p className="text-sm text-[#6B7280] mt-1">{property.locality}, Chennai</p>
                  </div>
                )}
              </div>

              {property.images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {property.images.map((img, idx) => (
                    <button
                      key={`${img}-${idx}`}
                      type="button"
                      onClick={() => {
                        setActiveImageIdx(idx);
                        setImageError(false);
                      }}
                      className={`relative w-24 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                        idx === activeImageIdx
                          ? 'border-[#7C3AED] opacity-100'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                      aria-label={`View photograph ${idx + 1}`}
                    >
                      <img
                        src={img}
                        alt={`${property.title} view ${idx + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title & Core Meta */}
            <div className="pb-8 border-b border-[#F3F0FF]">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#6B7280] mb-3">
                <span className="font-semibold text-[#7C3AED]">{property.listingType}</span>
                <span aria-hidden="true">·</span>
                <span>{property.category}</span>
                <span aria-hidden="true">·</span>
                <span className="font-medium text-[#7C3AED]">
                  {property.isSample ? 'Illustrative Sample Listing' : 'Owner Submitted Listing'}
                </span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#222222] leading-tight mb-3">
                {property.title}
              </h1>

              <p className="inline-flex items-center gap-1.5 text-base text-[#555555]">
                <MapPin className="w-4 h-4 text-[#7C3AED] shrink-0" />
                <span>
                  {property.locality}, {property.city}
                </span>
              </p>

              {/* Key Specifications Strip */}
              <div className="mt-7 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-[#F3F0FF]">
                <div>
                  <p className="text-xs text-[#6B7280] mb-1">
                    {property.listingType === 'Rent' ? 'Monthly Rent' : 'Lease Pricing'}
                  </p>
                  <p className="text-base font-bold text-[#222222] tabular-nums">
                    {property.priceLabel}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#6B7280] mb-1">Property Area</p>
                  <p className="text-base font-semibold text-[#222222] tabular-nums">
                    {property.areaDisplay}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#6B7280] mb-1">
                    {property.bedrooms ? 'Configuration' : 'Classification'}
                  </p>
                  <p className="text-base font-semibold text-[#222222]">
                    {property.bedrooms
                      ? `${property.bedrooms} BHK${property.bathrooms ? ` · ${property.bathrooms} Bath` : ''}`
                      : property.facing || 'Open Layout'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#6B7280] mb-1">Availability</p>
                  <p className="text-base font-semibold text-[#7C3AED]">{property.availability}</p>
                </div>
              </div>
            </div>

            {/* Overview & Description */}
            <div className="space-y-4 pb-8 border-b border-[#F3F0FF]">
              <h2 className="font-display text-2xl font-semibold text-[#222222]">
                Property Overview
              </h2>
              <p className="text-base text-[#444444] leading-relaxed">{property.description}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 text-sm">
                <div className="py-3 border-t border-[#F3F0FF]">
                  <span className="text-[#6B7280] block text-xs mb-0.5">Terms &amp; Deposit</span>
                  <span className="font-medium text-[#222222]">{property.depositOrTenure}</span>
                </div>
                <div className="py-3 border-t border-[#F3F0FF]">
                  <span className="text-[#6B7280] block text-xs mb-0.5">Furnishing / Zoning</span>
                  <span className="font-medium text-[#222222]">{property.furnishingOrZoning}</span>
                </div>
                {property.facing && (
                  <div className="py-3 border-t border-[#F3F0FF]">
                    <span className="text-[#6B7280] block text-xs mb-0.5">Orientation</span>
                    <span className="font-medium text-[#222222]">{property.facing}</span>
                  </div>
                )}
                <div className="py-3 border-t border-[#F3F0FF]">
                  <span className="text-[#6B7280] block text-xs mb-0.5">Locality</span>
                  <span className="font-medium text-[#222222]">
                    {property.locality}, Chennai, Tamil Nadu
                  </span>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="space-y-5 pb-8 border-b border-[#F3F0FF]">
              <h2 className="font-display text-2xl font-semibold text-[#222222]">
                Key Amenities &amp; Highlights
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-3.5 gap-x-6">
                {property.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2.5 text-sm text-[#333333]">
                    <Check className="w-4 h-4 text-[#7C3AED] shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location & Interactive Google Map */}
            <div className="space-y-4">
              <div>
                <h2 className="font-display text-2xl font-semibold text-[#222222]">
                  Location &amp; Neighborhood Map
                </h2>
                <p className="text-sm text-[#555555] mt-1">
                  {property.locality}, {property.city}
                </p>
              </div>
              <PropertyMap
                properties={[property]}
                selectedPropertyId={property.id}
                heightClass="h-[360px]"
                zoom={14}
                hasApiKey={hasMapsApiKey}
              />
            </div>
          </div>

          {/* Right Sticky Enquiry Module (4 cols) */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-[#DDD6FE] bg-white shadow-[0_8px_30px_rgba(124,58,237,0.06)] p-6">
              <div className="pb-5 mb-5 border-b border-[#F3F0FF]">
                <p className="text-xs font-medium text-[#7C3AED] mb-1">
                  {property.listingType === 'Rent' ? 'Monthly Rental' : 'Structured Lease'}
                </p>
                <p className="text-2xl font-bold text-[#222222] tabular-nums">
                  {property.priceLabel}
                </p>
                <p className="text-xs text-[#6B7280] mt-1">{property.depositOrTenure}</p>
              </div>

              {submittedRecord ? (
                <div className="rounded-xl bg-[#FAF8FF] border border-[#DDD6FE] p-5 text-center space-y-3">
                  <div className="w-11 h-11 rounded-full bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-semibold text-[#222222]">
                    Enquiry Received
                  </h3>
                  <p className="text-sm text-[#555555] leading-relaxed">
                    Thank you, {submittedRecord.name}. Your enquiry regarding{' '}
                    <span className="font-medium text-[#222222]">{property.title}</span> has been
                    recorded.
                  </p>
                  <p className="text-xs text-[#7C3AED] font-medium tabular-nums">
                    Reference: {submittedRecord.id}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedRecord(null);
                      setName('');
                      setEmail('');
                    }}
                    className="text-xs font-semibold text-[#7C3AED] hover:underline cursor-pointer"
                  >
                    Send another enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleEnquirySubmit} className="space-y-4" noValidate>
                  <h2 className="text-base font-semibold text-[#222222]">
                    Enquire About This Space
                  </h2>

                  <div>
                    <label
                      htmlFor="enquiry-name"
                      className="block text-xs font-semibold text-[#555555] mb-1.5"
                    >
                      Full Name
                    </label>
                    <input
                      id="enquiry-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full h-10 rounded-xl border border-[#E5E7EB] bg-white px-3.5 text-sm text-[#222222] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#EDE9FE] outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="enquiry-email"
                      className="block text-xs font-semibold text-[#555555] mb-1.5"
                    >
                      Email Address
                    </label>
                    <input
                      id="enquiry-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full h-10 rounded-xl border border-[#E5E7EB] bg-white px-3.5 text-sm text-[#222222] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#EDE9FE] outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="enquiry-intent"
                      className="block text-xs font-semibold text-[#555555] mb-1.5"
                    >
                      Enquiry Type
                    </label>
                    <select
                      id="enquiry-intent"
                      value={intent}
                      onChange={(e) => setIntent(e.target.value)}
                      className="w-full h-10 rounded-xl border border-[#E5E7EB] bg-white px-3 text-sm text-[#222222] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#EDE9FE] outline-none"
                    >
                      <option value="Schedule a property viewing">Schedule a property viewing</option>
                      <option value="Request lease terms & viewing">
                        Request lease terms &amp; viewing
                      </option>
                      <option value="Check availability & move-in dates">
                        Check availability &amp; move-in dates
                      </option>
                      <option value="Discuss corporate or commercial terms">
                        Discuss corporate or commercial terms
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="enquiry-message"
                      className="block text-xs font-semibold text-[#555555] mb-1.5"
                    >
                      Message
                    </label>
                    <textarea
                      id="enquiry-message"
                      rows={3}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3.5 py-2.5 text-sm text-[#222222] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#EDE9FE] outline-none resize-none"
                    />
                  </div>

                  {formError && (
                    <p role="alert" className="text-xs font-medium text-red-600">
                      {formError}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 text-sm font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Enquiry</span>
                  </button>
                </form>
              )}

              {/* WhatsApp Direct Enquiry (Zero Public Phone Number) */}
              <div className="mt-4 pt-4 border-t border-[#F3F0FF]">
                <button
                  type="button"
                  onClick={() =>
                    onOpenWhatsApp(
                      `Hello Spacupied, I would like to enquire about "${property.title}" (${property.priceLabel}) in ${property.locality}, Chennai.`
                    )
                  }
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 text-sm font-semibold text-[#7C3AED] bg-[#FAF8FF] hover:bg-[#EDE9FE] border border-[#DDD6FE] rounded-xl transition-colors cursor-pointer whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Enquire via WhatsApp</span>
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
