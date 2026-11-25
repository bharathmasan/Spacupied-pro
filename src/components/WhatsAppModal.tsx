import React, { useState, useEffect } from 'react';
import { Check, Copy, ExternalLink, MessageCircle, X } from 'lucide-react';

interface WhatsAppModalProps {
  isOpen: boolean;
  initialMessage: string;
  onClose: () => void;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  isOpen,
  initialMessage,
  onClose,
}) => {
  const [message, setMessage] = useState(initialMessage);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMessage(initialMessage);
    setCopied(false);
  }, [initialMessage, isOpen]);

  if (!isOpen) return null;

  // Uses WhatsApp deep-link with pre-filled enquiry text and zero public phone number disclosure
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/35 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="whatsapp-modal-title"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-[#EDE9FE] shadow-xl w-full max-w-lg p-6 sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 id="whatsapp-modal-title" className="text-lg font-semibold text-[#222222]">
                WhatsApp Enquiry
              </h2>
              <p className="text-xs text-[#6B7280]">
                Prepare your Spacupied enquiry message without public phone numbers
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl text-[#6B7280] hover:text-[#222222] hover:bg-[#F5F3FF] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close WhatsApp modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <label htmlFor="whatsapp-message" className="block text-sm font-medium text-[#222222] mb-2">
          Your enquiry message
        </label>
        <textarea
          id="whatsapp-message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-xl border border-[#DDD6FE] bg-white px-4 py-3 text-sm text-[#222222] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#EDE9FE] outline-none resize-none"
        />

        <p className="text-xs text-[#6B7280] mt-2 leading-relaxed">
          Spacupied respects privacy and never displays public phone numbers. Opening WhatsApp lets
          you send or share your enquiry message securely.
        </p>

        <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-[#222222] bg-white border border-[#DDD6FE] hover:bg-[#FAF8FF] rounded-xl transition-colors cursor-pointer whitespace-nowrap"
          >
            {copied ? <Check className="w-4 h-4 text-[#7C3AED]" /> : <Copy className="w-4 h-4 text-[#7C3AED]" />}
            <span>{copied ? 'Message Copied' : 'Copy Message'}</span>
          </button>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl transition-colors whitespace-nowrap"
          >
            <span>Open in WhatsApp</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
