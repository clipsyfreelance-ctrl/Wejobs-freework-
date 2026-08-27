import React, { useState } from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  onAdminTrigger?: () => void;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showTagline = false,
  onAdminTrigger,
  className = '',
}) => {
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  const handleClick = (e: React.MouseEvent) => {
    const now = Date.now();
    if (now - lastClickTime < 800) {
      const newCount = clickCount + 1;
      setClickCount(newCount);
      if (newCount >= 5) {
        setClickCount(0);
        if (onAdminTrigger) {
          onAdminTrigger();
        }
      }
    } else {
      setClickCount(1);
    }
    setLastClickTime(now);
  };

  const dimensions = {
    sm: { icon: 'w-7 h-7', text: 'text-lg', subtext: 'text-[9px]' },
    md: { icon: 'w-9 h-9', text: 'text-2xl', subtext: 'text-[10px]' },
    lg: { icon: 'w-12 h-12', text: 'text-3xl', subtext: 'text-xs' },
    xl: { icon: 'w-16 h-16', text: 'text-4xl', subtext: 'text-sm' },
  }[size];

  return (
    <div
      id="brand-logo-container"
      onClick={handleClick}
      title="WEJOBS - Micro Jobs • Simple Tasks • Real Rewards"
      className={`inline-flex items-center gap-2.5 select-none cursor-pointer group ${className}`}
    >
      {/* Brand Icon Badge - Crisp Vibrant Orange */}
      <div
        className={`${dimensions.icon} relative flex items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform duration-200`}
      >
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-5/6 h-5/6 drop-shadow-sm"
        >
          {/* Stylized geometric 'W' for WEJOBS */}
          <path
            d="M6 10L11 26L18 14L25 26L30 10"
            stroke="white"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Subtle reward spark dot */}
          <circle cx="18" cy="8" r="2.2" fill="#FEF08A" />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={`font-black tracking-tight ${dimensions.text} text-neutral-900 dark:text-white font-sans`}
          >
            WE<span className="text-orange-600 dark:text-orange-500">JOBS</span>
          </span>
          <span className="inline-block px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-400 border border-orange-200 dark:border-orange-800/60">
            USD
          </span>
        </div>

        {showTagline && (
          <span
            className={`mt-1 font-semibold tracking-widest uppercase text-neutral-500 dark:text-neutral-400 ${dimensions.subtext}`}
          >
            MICRO JOBS • SIMPLE TASKS • REAL REWARDS
          </span>
        )}
      </div>
    </div>
  );
};
