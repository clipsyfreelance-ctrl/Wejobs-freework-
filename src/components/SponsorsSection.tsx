import React from 'react';

/**
 * WEJOBS Infinite Moving Sponsor Logos Marquee
 * Features dynamic live infinite scrolling with Remote logos + Rocket sprite logos (Meta, PayPal, EA, Salesforce, Google, Amazon, etc.)
 */

interface RemoteLogo {
  type: 'remote';
  name: string;
  src: string;
}

interface RocketLogo {
  type: 'rocket';
  name: string;
  x: number;
  y: number;
  w: number;
  s: number;
}

type SponsorLogoItem = RemoteLogo | RocketLogo;

const REMOTE_LOGOS: RemoteLogo[] = [
  { type: 'remote', name: 'Google', src: 'https://www.remotejobs.io/blobcontent/rji/images/google.png' },
  { type: 'remote', name: 'Amazon', src: 'https://www.remotejobs.io/blobcontent/rji/images/amazon.png' },
  { type: 'remote', name: 'DoorDash', src: 'https://www.remotejobs.io/blobcontent/rji/images/doordash.png' },
  { type: 'remote', name: 'Zillow', src: 'https://www.remotejobs.io/blobcontent/rji/images/zillow.png' },
  { type: 'remote', name: 'Twilio', src: 'https://www.remotejobs.io/blobcontent/rji/images/twilio.png' },
];

const ROCKET_LOGOS: RocketLogo[] = [
  { type: 'rocket', name: 'Electronic Arts', x: 0.0, y: 15.0, w: 176.6, s: 0.7429 },
  { type: 'rocket', name: 'Salesforce', x: 340.98, y: 10.0, w: 49.64, s: 0.6783 },
  { type: 'rocket', name: 'Meta', x: 441.08, y: 28.33, w: 88.7, s: 1.2 },
  { type: 'rocket', name: 'Pine Labs', x: 582.68, y: 26.67, w: 87.89, s: 1.1143 },
  { type: 'rocket', name: 'UC Berkeley', x: 722.66, y: 25.0, w: 116.37, s: 1.04 },
  { type: 'rocket', name: 'Palo Alto Software', x: 892.74, y: 25.0, w: 171.71, s: 1.04 },
  { type: 'rocket', name: 'PayPal', x: 1115.72, y: 25.0, w: 84.64, s: 1.1143 },
  { type: 'rocket', name: 'Sky', x: 1252.44, y: 18.33, w: 48.83, s: 0.8211 },
  { type: 'rocket', name: 'ING', x: 1516.11, y: 28.33, w: 30.11, s: 1.248 },
  { type: 'rocket', name: 'FloSports', x: 1596.68, y: 28.33, w: 18.72, s: 1.248 },
  { type: 'rocket', name: 'Scentsy', x: 1805.83, y: 31.67, w: 78.94, s: 1.4182 },
  { type: 'rocket', name: 'Times Internet', x: 1943.36, y: 30.0, w: 61.04, s: 1.3 },
  { type: 'rocket', name: 'Experian', x: 2056.48, y: 20.0, w: 84.64, s: 0.8667 },
  { type: 'rocket', name: 'KPMG', x: 2291.67, y: 21.67, w: 68.36, s: 0.8667 },
  { type: 'rocket', name: 'Intuit', x: 2411.3, y: 28.33, w: 88.7, s: 1.1556 },
];

const ALL_SPONSORS: SponsorLogoItem[] = [...REMOTE_LOGOS, ...ROCKET_LOGOS];

export const SponsorMarquee: React.FC<any> = () => {
  const renderLogoItem = (item: SponsorLogoItem, index: number) => {
    return (
      <div
        key={`${item.name}-${index}`}
        className="sponsor-item"
        title={item.name}
      >
        <div className="sponsor-card">
          {item.type === 'remote' ? (
            <img
              className="logo remote-logo"
              src={item.src}
              alt={item.name}
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div
              className="rocket-logo"
              aria-label={item.name}
              style={{
                width: `${item.w * item.s}px`,
                backgroundSize: `${2500 * item.s}px ${100 * item.s}px`,
                backgroundPosition: `${-item.x * item.s}px ${-item.y * item.s}px`,
              }}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <section className="sponsor-section" aria-label="Sponsor dan partner">
        <div className="sponsor-header">
          <div className="sponsor-badge">
            <span className="sponsor-dot"></span>
            <span>TRUSTED BY COMPANIES</span>
          </div>
          <h2 className="sponsor-heading">
            Freelancers work with leading global companies
          </h2>
        </div>

        <div className="sponsor-marquee">
          <div className="fade left"></div>
          <div className="fade right"></div>

          <div className="sponsor-track">
            {/* Track Group 1 */}
            <div className="sponsor-group">
              {ALL_SPONSORS.map((item, idx) => renderLogoItem(item, idx))}
            </div>

            {/* Track Group 2 (Duplicate for seamless moving loop) */}
            <div className="sponsor-group" aria-hidden="true">
              {ALL_SPONSORS.map((item, idx) => renderLogoItem(item, idx + 100))}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .sponsor-section {
          width: 100%;
          overflow: hidden;
          padding: 52px 0 56px 0;
          background: #080808;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          position: relative;
        }

        .sponsor-header {
          text-align: center;
          padding: 0 20px 30px;
        }

        .sponsor-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 5px 14px;
          border-radius: 9999px;
          background: rgba(249, 115, 22, 0.1);
          border: 1px solid rgba(249, 115, 22, 0.25);
          color: #fb923c;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 12px;
          font-family: 'Cabinet Grotesk', 'Outfit', sans-serif;
        }

        .sponsor-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #f97316;
          box-shadow: 0 0 8px #f97316;
        }

        .sponsor-heading {
          margin: 0;
          font-size: 26px;
          font-weight: 800;
          line-height: 1.25;
          color: #f1f5f9;
          font-family: 'Cabinet Grotesk', 'Outfit', sans-serif;
          letter-spacing: -0.02em;
        }

        .sponsor-marquee {
          position: relative;
          width: 100%;
          overflow: hidden;
          padding: 12px 0;
        }

        .sponsor-track {
          display: flex;
          width: max-content;
          animation: logo-scroll 45s linear infinite;
          will-change: transform;
        }

        .sponsor-marquee:hover .sponsor-track {
          animation-play-state: paused;
        }

        .sponsor-group {
          display: flex;
          align-items: center;
          flex-shrink: 0;
          gap: 20px;
          padding-right: 20px;
        }

        .sponsor-item {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sponsor-card {
          min-width: 180px;
          height: 80px;
          padding: 14px 24px;
          background: #111111;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
        }

        .sponsor-card:hover {
          background: #181818;
          border-color: rgba(249, 115, 22, 0.4);
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 8px 24px rgba(249, 115, 22, 0.12);
        }

        .logo {
          display: block;
          width: auto;
          max-width: 160px;
          height: 44px;
          object-fit: contain;
          object-position: center;
          filter: brightness(1.2) contrast(1.05);
          transition: all 0.3s ease;
        }

        .sponsor-card:hover .logo {
          filter: brightness(1.35) contrast(1.15);
        }

        .rocket-logo {
          height: 48px;
          background-image: url("https://assets.rocket.new/rocket/c-logo-new.webp");
          background-repeat: no-repeat;
          flex: 0 0 auto;
          filter: brightness(1.15) contrast(1.05);
          transition: all 0.3s ease;
        }

        .sponsor-card:hover .rocket-logo {
          filter: brightness(1.35) contrast(1.15);
        }

        .fade {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 160px;
          z-index: 10;
          pointer-events: none;
        }

        .fade.left {
          left: 0;
          background: linear-gradient(90deg, #080808 0%, rgba(8, 8, 8, 0.85) 45%, rgba(8, 8, 8, 0) 100%);
        }

        .fade.right {
          right: 0;
          background: linear-gradient(270deg, #080808 0%, rgba(8, 8, 8, 0.85) 45%, rgba(8, 8, 8, 0) 100%);
        }

        @keyframes logo-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @media (max-width: 900px) {
          .sponsor-card {
            min-width: 155px;
            height: 70px;
            padding: 10px 18px;
          }
          .logo {
            height: 38px;
            max-width: 135px;
          }
          .rocket-logo {
            height: 42px;
          }
          .sponsor-heading {
            font-size: 22px;
          }
          .fade {
            width: 90px;
          }
          .sponsor-track {
            animation-duration: 38s;
          }
        }

        @media (max-width: 600px) {
          .sponsor-section {
            padding: 38px 0 42px;
          }
          .sponsor-header {
            padding-bottom: 20px;
          }
          .sponsor-heading {
            font-size: 19px;
          }
          .sponsor-card {
            min-width: 135px;
            height: 62px;
            padding: 8px 14px;
            border-radius: 10px;
          }
          .sponsor-group {
            gap: 12px;
            padding-right: 12px;
          }
          .logo {
            height: 32px;
            max-width: 110px;
          }
          .rocket-logo {
            height: 36px;
          }
          .sponsor-track {
            animation-duration: 30s;
          }
          .fade {
            width: 60px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .sponsor-track {
            animation: none;
          }
        }
      `}</style>
    </>
  );
};

export const SponsorsSection: React.FC<any> = SponsorMarquee;


