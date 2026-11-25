import React, { useState } from 'react';
import { CheckCircle2, MapPin, MessageCircle, Send } from 'lucide-react';
import { EnquiryRecord } from '../types';

interface ContactPageProps {
  onSubmitEnquiry: (enquiry: Omit<EnquiryRecord, 'id' | 'submittedAt'>) => EnquiryRecord;
  onOpenWhatsApp: (contextText?: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  onSubmitEnquiry,
  onOpenWhatsApp,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('Tenant / Space Search Assistance');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState<EnquiryRecord | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (message.trim().length < 10) {
      setError('Please include a brief message describing how we can assist you.');
      return;
    }

    const record = onSubmitEnquiry({
      name: name.trim(),
      email: email.trim(),
      intent: topic,
      message: message.trim(),
    });
    setSubmitted(record);
  };

  return (
    <div className="bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Info Column — Minimal, Trustworthy, Zero Phone Numbers */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <p className="text-sm font-medium text-[#7C3AED] mb-2">Contact Spacupied</p>
              <h1 className="font-display text-4xl font-semibold text-[#222222] leading-tight mb-4">
                Start a Conversation With Our Team
              </h1>
              <p className="text-base text-[#555555] leading-relaxed">
                Whether you are searching for a residence or workspace in Chennai, or preparing to
                list your property or land for lease, send us a message below or connect via
                WhatsApp.
              </p>
            </div>

            <div className="space-y-5 pt-6 border-t border-[#F3F0FF]">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-[#222222]">Service Region</h2>
                  <p className="text-sm text-[#555555] mt-0.5">
                    Chennai &amp; Greater Chennai, Tamil Nadu, India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-[#222222]">WhatsApp Messaging</h2>
                  <p className="text-sm text-[#555555] mt-0.5 mb-3">
                    Compose and send a direct enquiry via WhatsApp without exposed public phone
                    numbers.
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      onOpenWhatsApp(
                        'Hello Spacupied team, I have a question regarding renting or leasing a property in Chennai.'
                      )
                    }
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#7C3AED] bg-[#FAF8FF] hover:bg-[#EDE9FE] border border-[#DDD6FE] rounded-xl transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Open WhatsApp Enquiry</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-[#DDD6FE] bg-white shadow-[0_8px_30px_rgba(124,58,237,0.05)] p-6 sm:p-9">
              {submitted ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h2 className="font-display text-2xl font-semibold text-[#222222]">
                    Message Received
                  </h2>
                  <p className="text-sm text-[#555555] max-w-md mx-auto leading-relaxed">
                    Thank you, {submitted.name}. Your message regarding{' '}
                    <span className="font-medium text-[#222222]">{submitted.intent}</span> has been
                    logged.
                  </p>
                  <p className="text-xs font-medium text-[#7C3AED] tabular-nums">
                    Reference: {submitted.id}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(null);
                      setName('');
                      setEmail('');
                      setMessage('');
                    }}
                    className="text-sm font-semibold text-[#7C3AED] hover:underline cursor-pointer"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <h2 className="text-xl font-semibold text-[#222222]">Send an Enquiry</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-xs font-semibold text-[#555555] mb-1.5"
                      >
                        Full Name *
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                        className="w-full h-11 rounded-xl border border-[#E5E7EB] px-4 text-sm text-[#222222] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#EDE9FE] outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-xs font-semibold text-[#555555] mb-1.5"
                      >
                        Email Address *
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full h-11 rounded-xl border border-[#E5E7EB] px-4 text-sm text-[#222222] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#EDE9FE] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-topic"
                      className="block text-xs font-semibold text-[#555555] mb-1.5"
                    >
                      How Can We Help?
                    </label>
                    <select
                      id="contact-topic"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="w-full h-11 rounded-xl border border-[#E5E7EB] bg-white px-3.5 text-sm text-[#222222] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#EDE9FE] outline-none"
                    >
                      <option value="Tenant / Space Search Assistance">
                        Tenant / Space Search Assistance
                      </option>
                      <option value="Listing a Residential or Commercial Property">
                        Listing a Residential or Commercial Property
                      </option>
                      <option value="Residential Plot or Agricultural Land Lease">
                        Residential Plot or Agricultural Land Lease
                      </option>
                      <option value="Corporate & Business Leasing">
                        Corporate &amp; Business Leasing
                      </option>
                      <option value="General Platform Question">General Platform Question</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-xs font-semibold text-[#555555] mb-1.5"
                    >
                      Message *
                    </label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Share your preferred Chennai locality, property type, timeline, or question..."
                      className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm text-[#222222] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#EDE9FE] outline-none"
                    />
                  </div>

                  {error && (
                    <p role="alert" className="text-xs font-medium text-red-600">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Message</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
