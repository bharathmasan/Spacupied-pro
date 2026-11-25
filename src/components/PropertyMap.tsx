import React, { useState } from 'react';
import {
  Map as GoogleMap,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useAdvancedMarkerRef,
} from '@vis.gl/react-google-maps';
import { MapPin } from 'lucide-react';
import { Property } from '../types';

interface SingleMarkerProps {
  property: Property;
  isSelected: boolean;
  onSelect: () => void;
  onClose: () => void;
  onViewProperty?: (id: string) => void;
}

const PropertyMarkerItem: React.FC<SingleMarkerProps> = ({
  property,
  isSelected,
  onSelect,
  onClose,
  onViewProperty,
}) => {
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={property.coordinates}
        title={`${property.title} — ${property.locality}, Chennai`}
        onClick={onSelect}
      >
        <Pin
          background={isSelected ? '#5B21B6' : '#7C3AED'}
          borderColor="#FFFFFF"
          glyphColor="#FFFFFF"
          scale={isSelected ? 1.2 : 1.05}
        />
      </AdvancedMarker>
      {isSelected && marker && (
        <InfoWindow anchor={marker} maxWidth={260} onCloseClick={onClose}>
          <div className="p-1 text-[#222222] font-sans">
            <p className="text-[11px] font-medium text-[#7C3AED] mb-0.5">
              {property.listingType} · {property.isSample ? 'Sample Pin' : 'Owner Listing'}
            </p>
            <p className="text-sm font-semibold leading-snug mb-1">{property.title}</p>
            <p className="text-xs text-[#555555] mb-1.5">{property.locality}, Chennai</p>
            <p className="text-sm font-bold text-[#222222] tabular-nums">{property.priceLabel}</p>
            {onViewProperty && (
              <button
                type="button"
                onClick={() => onViewProperty(property.id)}
                className="mt-2.5 text-xs font-semibold text-[#7C3AED] hover:text-[#6D28D9] underline underline-offset-2 cursor-pointer"
              >
                View Property Details
              </button>
            )}
          </div>
        </InfoWindow>
      )}
    </>
  );
};

interface PropertyMapProps {
  properties: Property[];
  selectedPropertyId?: string | null;
  onViewProperty?: (id: string) => void;
  heightClass?: string;
  zoom?: number;
  hasApiKey: boolean;
}

export const PropertyMap: React.FC<PropertyMapProps> = ({
  properties,
  selectedPropertyId = null,
  onViewProperty,
  heightClass = 'h-[380px]',
  zoom = 12,
  hasApiKey,
}) => {
  const [activeId, setActiveId] = useState<string | null>(selectedPropertyId);

  const center =
    properties.length === 1
      ? properties[0].coordinates
      : { lat: 13.0067, lng: 80.2206 }; // Central Chennai reference

  if (!hasApiKey) {
    return (
      <div
        className={`${heightClass} w-full rounded-2xl border border-[#EDE9FE] bg-[#FAF8FF] flex flex-col items-center justify-center p-6 text-center`}
      >
        <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center mb-3">
          <MapPin className="w-6 h-6" />
        </div>
        <p className="text-base font-semibold text-[#222222]">
          {properties.length === 1
            ? `${properties[0].locality}, ${properties[0].city}`
            : 'Chennai, Tamil Nadu'}
        </p>
        <p className="text-sm text-[#6B7280] max-w-md mt-1">
          Interactive Google Maps preview activates automatically once your Google Maps API key is configured.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div
        className={`${heightClass} w-full rounded-2xl overflow-hidden border border-[#EDE9FE] bg-[#FAF8FF]`}
      >
        <GoogleMap
          mapId="DEMO_MAP_ID"
          defaultCenter={center}
          defaultZoom={zoom}
          gestureHandling="cooperative"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          style={{ width: '100%', height: '100%' }}
        >
          {properties.map((property) => (
            <PropertyMarkerItem
              key={property.id}
              property={property}
              isSelected={activeId === property.id}
              onSelect={() => setActiveId(property.id)}
              onClose={() => setActiveId(null)}
              onViewProperty={onViewProperty}
            />
          ))}
        </GoogleMap>
      </div>
      <p className="text-xs text-[#6B7280]">
        Map pins indicate approximate Chennai locality centers for illustrative sample listings.
      </p>
    </div>
  );
};
