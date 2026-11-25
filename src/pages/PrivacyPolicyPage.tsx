import React from 'react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="pb-8 border-b border-[#EDE9FE] mb-10">
          <p className="text-sm font-medium text-[#7C3AED] mb-2">Legal &amp; Trust</p>
          <h1 className="font-display text-4xl font-semibold text-[#222222] mb-3">
            Privacy Policy
          </h1>
          <p className="text-sm text-[#6B7280]">
            Last updated: November 2026 · Spacupied (Chennai, Tamil Nadu, India)
          </p>
        </div>

        <div className="space-y-8 text-sm sm:text-base text-[#444444] leading-relaxed">
          <section className="space-y-2.5">
            <h2 className="text-lg font-semibold text-[#222222]">1. Information You Provide</h2>
            <p>
              When you submit a property listing or send an enquiry on Spacupied, you may provide
              your name, email address, property specifications, and enquiry details. We collect
              only the information necessary to display submitted listings and facilitate rental or
              leasing inquiries.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-lg font-semibold text-[#222222]">
              2. No Public Phone Number Exposure
            </h2>
            <p>
              Spacupied is designed with privacy-first communication. We do not publish personal
              telephone numbers on public property pages or contact pages. Enquiries are handled via
              structured forms or user-initiated WhatsApp message drafts.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-lg font-semibold text-[#222222]">
              3. Local Browser Storage &amp; Session Data
            </h2>
            <p>
              Properties submitted through the &ldquo;List Your Property&rdquo; form and enquiry
              confirmations may be stored locally in your browser&apos;s storage so your submitted
              listings remain visible while you explore Spacupied. You may clear this data at any
              time through your browser settings.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-lg font-semibold text-[#222222]">
              4. Google Maps Platform Integration
            </h2>
            <p>
              Spacupied integrates interactive maps powered by Google Maps Platform to illustrate
              Chennai localities. By using our map features, you agree to be bound by the{' '}
              <a
                href="https://maps.google.com/help/terms_maps/?utm_campaign=gmp_mcp_codeassist_v1_aistudio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#7C3AED] underline underline-offset-2 hover:text-[#6D28D9]"
              >
                Google Maps/Google Earth Additional Terms of Service
              </a>{' '}
              and the{' '}
              <a
                href="https://policies.google.com/privacy?utm_campaign=gmp_mcp_codeassist_v1_aistudio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#7C3AED] underline underline-offset-2 hover:text-[#6D28D9]"
              >
                Google Privacy Policy
              </a>
              . Spacupied does not track your real-time device location without explicit consent.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-lg font-semibold text-[#222222]">5. Sample Listing Notice</h2>
            <p>
              Listings identified as &ldquo;Sample Listing&rdquo; are illustrative placeholders
              created to demonstrate Spacupied&apos;s features across Chennai localities and do not
              represent private personal property data.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-lg font-semibold text-[#222222]">6. Your Rights &amp; Updates</h2>
            <p>
              You may request updates or removal of any enquiry or listing information you submit
              using our Contact Us page. We may update this Privacy Policy periodically to reflect
              improvements in our platform practices.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
