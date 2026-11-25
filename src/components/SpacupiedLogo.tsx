import React from 'react';

interface SpacupiedLogoProps {
  className?: string;
}

export const SpacupiedLogo: React.FC<SpacupiedLogoProps> = ({ className = '' }) => {
  return (
    <span className={`inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 ${className}`}>
      <svg
        width="30"
        height="30"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <rect x="2" y="2" width="28" height="28" rx="8" fill="#EDE9FE" />
        <path
          d="M9 17.5L16 10.5L23 17.5"
          stroke="#7C3AED"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11.5 15.5V22.5H20.5V15.5"
          stroke="#7C3AED"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="14.5" y="18" width="3" height="4.5" rx="0.75" fill="#7C3AED" />
      </svg>
      <span className="font-display text-[22px] font-semibold tracking-tight text-[#222222] leading-none">
        Spacupied
      </span>
    </span>
  );
};
