import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { SAMPLE_PROPERTIES } from './data/sampleProperties';
import {
  EnquiryRecord,
  PageRoute,
  Property,
  PropertyCategory,
  SearchFilters,
} from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WhatsAppModal } from './components/WhatsAppModal';
import { HomePage } from './pages/HomePage';
import { ListingsPage } from './pages/ListingsPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { ListPropertyPage } from './pages/ListPropertyPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { FaqsPage } from './pages/FaqsPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';

const MAPS_API_KEY = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined) || '';
const CUSTOM_PROPERTIES_KEY = 'spacupied_custom_properties_v1';
const ENQUIRIES_KEY = 'spacupied_enquiries_v1';

const DEFAULT_FILTERS: SearchFilters = {
  query: '',
  locality: 'All',
  category: 'All',
  listingType: 'All',
  minRent: '',
  maxRent: '',
  minLease: '',
  maxLease: '',
  minArea: '',
  maxArea: '',
  bedrooms: 'All',
  availability: 'All',
  sortBy: 'featured',
};

const PAGE_TITLES: Record<PageRoute, string> = {
  home: 'Spacupied – Real Estate Rental & Leasing Platform in Chennai',
  listings: 'Property Listings in Chennai | Spacupied',
  'property-detail': 'Property Details | Spacupied Chennai',
  'list-property': 'List Your Property in Chennai | Spacupied',
  about: 'About Us | Spacupied Chennai',
  contact: 'Contact Us | Spacupied Chennai',
  faqs: 'Frequently Asked Questions | Spacupied Chennai',
  privacy: 'Privacy Policy | Spacupied Chennai',
};

function loadStoredProperties(): Property[] {
  try {
    const raw = localStorage.getItem(CUSTOM_PROPERTIES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageRoute>('home');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [customProperties, setCustomProperties] = useState<Property[]>(loadStoredProperties);
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [mapsQuotaExceeded, setMapsQuotaExceeded] = useState(false);

  // WhatsApp modal state (zero public phone numbers)
  const [whatsAppOpen, setWhatsAppOpen] = useState(false);
  const [whatsAppMessage, setWhatsAppMessage] = useState(
    'Hello Spacupied team, I would like assistance with rental or leasing properties in Chennai.'
  );

  // Listen for Google Maps Platform demo quota warning event
  useEffect(() => {
    const onQuotaExceeded = () => setMapsQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', onQuotaExceeded);
    return () => window.removeEventListener('gmp-quota-exceeded', onQuotaExceeded);
  }, []);

  const allProperties = useMemo(
    () => [...customProperties, ...SAMPLE_PROPERTIES],
    [customProperties]
  );

  const selectedProperty = useMemo(
    () => allProperties.find((p) => p.id === selectedPropertyId) || null,
    [allProperties, selectedPropertyId]
  );

  // Keep SEO page title synced with current route or property
  useEffect(() => {
    if (currentPage === 'property-detail' && selectedProperty) {
      document.title = `${selectedProperty.title} – ${selectedProperty.locality}, Chennai | Spacupied`;
    } else {
      document.title = PAGE_TITLES[currentPage];
    }
  }, [currentPage, selectedProperty]);

  const navigate = useCallback((page: PageRoute) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSelectProperty = useCallback((id: string) => {
    setSelectedPropertyId(id);
    setCurrentPage('property-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleApplySearch = useCallback((partial: Partial<SearchFilters>) => {
    setFilters({ ...DEFAULT_FILTERS, ...partial });
    setCurrentPage('listings');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSelectCategory = useCallback((category: PropertyCategory) => {
    setFilters({ ...DEFAULT_FILTERS, category });
    setCurrentPage('listings');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleUpdateFilters = useCallback((partial: Partial<SearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const handleAddProperty = useCallback((newProperty: Property) => {
    setCustomProperties((prev) => {
      const updated = [newProperty, ...prev];
      try {
        localStorage.setItem(CUSTOM_PROPERTIES_KEY, JSON.stringify(updated));
      } catch {
        // Ignore storage quota errors cleanly
      }
      return updated;
    });
  }, []);

  const handleSubmitEnquiry = useCallback(
    (payload: Omit<EnquiryRecord, 'id' | 'submittedAt'>): EnquiryRecord => {
      const record: EnquiryRecord = {
        ...payload,
        id: `SPQ-${Math.floor(100000 + Math.random() * 900000)}`,
        submittedAt: new Date().toISOString(),
      };
      try {
        const existingRaw = localStorage.getItem(ENQUIRIES_KEY);
        const existing: EnquiryRecord[] = existingRaw ? JSON.parse(existingRaw) : [];
        localStorage.setItem(ENQUIRIES_KEY, JSON.stringify([record, ...existing]));
      } catch {
        // Ignore storage quota errors cleanly
      }
      return record;
    },
    []
  );

  const handleOpenWhatsApp = useCallback((contextText?: string) => {
    if (contextText) {
      setWhatsAppMessage(contextText);
    }
    setWhatsAppOpen(true);
  }, []);

  const hasMapsApiKey = Boolean(MAPS_API_KEY);

  const content = (
    <div className="min-h-screen flex flex-col bg-white text-[#222222]">
      {mapsQuotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      <Navbar currentPage={currentPage} onNavigate={navigate} />

      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            properties={allProperties}
            onNavigate={navigate}
            onSelectProperty={handleSelectProperty}
            onApplySearch={handleApplySearch}
            onOpenWhatsApp={handleOpenWhatsApp}
          />
        )}

        {currentPage === 'listings' && (
          <ListingsPage
            properties={allProperties}
            filters={filters}
            onUpdateFilters={handleUpdateFilters}
            onResetFilters={handleResetFilters}
            onSelectProperty={handleSelectProperty}
            hasMapsApiKey={hasMapsApiKey}
          />
        )}

        {currentPage === 'property-detail' && selectedProperty && (
          <PropertyDetailPage
            property={selectedProperty}
            onBack={() => navigate('listings')}
            onSubmitEnquiry={handleSubmitEnquiry}
            onOpenWhatsApp={handleOpenWhatsApp}
            hasMapsApiKey={hasMapsApiKey}
          />
        )}

        {currentPage === 'property-detail' && !selectedProperty && (
          <ListingsPage
            properties={allProperties}
            filters={filters}
            onUpdateFilters={handleUpdateFilters}
            onResetFilters={handleResetFilters}
            onSelectProperty={handleSelectProperty}
            hasMapsApiKey={hasMapsApiKey}
          />
        )}

        {currentPage === 'list-property' && (
          <ListPropertyPage
            onAddProperty={handleAddProperty}
            onViewProperty={handleSelectProperty}
          />
        )}

        {currentPage === 'about' && <AboutPage onNavigate={navigate} />}

        {currentPage === 'contact' && (
          <ContactPage
            onSubmitEnquiry={handleSubmitEnquiry}
            onOpenWhatsApp={handleOpenWhatsApp}
          />
        )}

        {currentPage === 'faqs' && <FaqsPage onNavigate={navigate} />}

        {currentPage === 'privacy' && <PrivacyPolicyPage />}
      </main>

      <Footer
        onNavigate={navigate}
        onSelectCategory={handleSelectCategory}
        onOpenWhatsApp={handleOpenWhatsApp}
      />

      <WhatsAppModal
        isOpen={whatsAppOpen}
        initialMessage={whatsAppMessage}
        onClose={() => setWhatsAppOpen(false)}
      />
    </div>
  );

  if (hasMapsApiKey) {
    return (
      <APIProvider apiKey={MAPS_API_KEY} libraries={['marker']} language="en" region="IN">
        {content}
      </APIProvider>
    );
  }

  return content;
}
