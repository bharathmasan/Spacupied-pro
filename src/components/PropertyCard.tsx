import React, { useState } from 'react';
import { ArrowUpRight, Building2, MapPin } from 'lucide-react';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
  onSelect: (propertyId: string) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onSelect }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <article
      onClick={() => onSelect(property.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(property.id);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${property.title}`}
      className="group bg-white rounded-2xl border border-[#ECE8F8] hover:border-[#C4B5FD] shadow-[0_2px_12px_rgba(124,58,237,0.04)] hover:shadow-[0_12px_32px_rgba(124,58,237,0.10)] transition-all duration-200 hover:-translate-y-0.5 overflow-hidden flex flex-col cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7C3AED]"
    >
      {/* 4:3 Uniform Media Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F7F5FF]">
        {!imageError && property.images[0] ? (
          <img
            src={property.images[0]}
            alt={`${property.title} in ${property.locality}, Chennai`}
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#F5F3FF]">
            <Building2 className="w-8 h-8 text-[#7C3AED] mb-2" />
            <span className="text-sm font-medium text-[#222222]">{property.title}</span>
            <span className="text-xs text-[#6B7280] mt-1">{property.locality}, Chennai</span>
          </div>
        )}
      </div>

      {/* Content Block — Unboxed Metadata & Clear Hierarchy */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Clean unboxed kicker line */}
        <div className="flex items-center justify-between gap-2 text-xs text-[#6B7280] mb-2">
          <span className="truncate">
            <span className="font-medium text-[#7C3AED]">{property.listingType}</span>
            <span aria-hidden="true" className="mx-1.5 text-[#D1D5DB]">·</span>
            <span>{property.category}</span>
          </span>
          <span className="shrink-0 text-[11px] text-[#7C3AED]/80 font-medium">
            {property.isSample ? 'Sample Listing' : 'Owner Listing'}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-[17px] font-semibold text-[#222222] group-hover:text-[#7C3AED] transition-colors leading-snug line-clamp-2 mb-1.5">
          {property.title}
        </h3>

        {/* Locality */}
        <p className="inline-flex items-center gap-1.5 text-sm text-[#555555] mb-3">
          <MapPin className="w-3.5 h-3.5 text-[#7C3AED] shrink-0" />
          <span className="truncate">{property.locality}, Chennai</span>
        </p>

        {/* Short description */}
        <p className="text-sm text-[#666666] leading-relaxed line-clamp-2 mb-4">
          {property.shortDescription}
        </p>

        {/* Specs & Price Footer */}
        <div className="mt-auto pt-4 border-t border-[#F3F0FF] flex items-end justify-between gap-3">
          <div>
            <p className="text-base font-bold text-[#222222] tabular-nums">
              {property.priceLabel}
            </p>
            <p className="text-xs text-[#6B7280] mt-0.5 tabular-nums">
              {property.areaDisplay}
              {property.bedrooms ? ` · ${property.bedrooms} BHK` : ''}
              {' · '}
              {property.availability}
            </p>
          </div>
          <span
            aria-hidden="true"
            className="w-9 h-9 rounded-xl bg-[#F5F3FF] group-hover:bg-[#7C3AED] text-[#7C3AED] group-hover:text-white flex items-center justify-center transition-colors duration-200 shrink-0"
          >
            <ArrowUpRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </article>
  );
};
