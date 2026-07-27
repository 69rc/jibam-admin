/**
 * JibamLogo — Official brand logo for admin dashboard
 * Renders SVG-based shield + wordmark matching the official Jibam Pharmacy logo.
 *
 * Props:
 *   size     — 'xs' | 'sm' | 'md' | 'lg' | 'xl'
 *   light    — true = white version (for dark/navy backgrounds)
 *   variant  — 'full' | 'icon' | 'text'
 */

const SIZES = {
  xs: { shield: 22, jibam: 13, pharmacy: 9,  rc: 7,  gap: 6 },
  sm: { shield: 30, jibam: 18, pharmacy: 12, rc: 8,  gap: 8 },
  md: { shield: 40, jibam: 24, pharmacy: 16, rc: 9,  gap: 10 },
  lg: { shield: 52, jibam: 32, pharmacy: 21, rc: 10, gap: 12 },
  xl: { shield: 68, jibam: 42, pharmacy: 28, rc: 12, gap: 16 },
};

function ShieldSVG({ size, navy, cyan }) {
  const s = size;
  const h = Math.round(s * 1.18);
  const sw = Math.max(1.5, s * 0.04); // stroke width

  return (
    <svg
      width={s}
      height={h}
      viewBox={`0 0 60 72`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Jibam Pharmacy shield logo"
    >
      {/* Shield outline */}
      <path
        d="M30 4L6 14V36C6 52 18 64 30 68C42 64 54 52 54 36V14L30 4Z"
        stroke={navy}
        strokeWidth={sw * 12}
        strokeLinejoin="round"
        fill="none"
      />
      {/* Caduceus rod */}
      <line x1="30" y1="18" x2="30" y2="54" stroke={navy} strokeWidth={sw * 10} strokeLinecap="round" />
      {/* Top crossbar */}
      <line x1="18" y1="25" x2="42" y2="25" stroke={navy} strokeWidth={sw * 9} strokeLinecap="round" />
      {/* Circuit nodes on top */}
      <line x1="18" y1="25" x2="14" y2="25" stroke={navy} strokeWidth={sw * 7} strokeLinecap="round" />
      <line x1="42" y1="25" x2="46" y2="25" stroke={navy} strokeWidth={sw * 7} strokeLinecap="round" />
      {/* Mid crossbar */}
      <line x1="21" y1="32" x2="39" y2="32" stroke={navy} strokeWidth={sw * 7} strokeLinecap="round" />
      {/* S-curve top (right curl) */}
      <path d="M30 30 Q40 33 34 38" stroke={cyan} strokeWidth={sw * 9} fill="none" strokeLinecap="round" />
      {/* S-curve bottom (left curl) */}
      <path d="M30 38 Q20 41 26 46" stroke={cyan} strokeWidth={sw * 9} fill="none" strokeLinecap="round" />
      {/* Top node (circle) */}
      <circle cx="30" cy="16" r={sw * 6} fill={navy} />
      {/* Bottom node */}
      <circle cx="30" cy="56" r={sw * 5} fill={cyan} />
    </svg>
  );
}

export default function JibamLogo({
  size = 'md',
  light = false,
  variant = 'full',
  className = '',
}) {
  const s = SIZES[size] || SIZES.md;
  const navy  = light ? '#FFFFFF' : '#0D1B5E';
  const cyan  = light ? 'rgba(255,255,255,0.85)' : '#00AEEF';
  const rcClr = light ? 'rgba(255,255,255,0.55)' : '#8A93B2';

  if (variant === 'icon') {
    return <ShieldSVG size={s.shield} navy={navy} cyan={cyan} />;
  }

  if (variant === 'text') {
    return (
      <div className={`flex flex-col leading-none ${className}`}>
        <span style={{ fontSize: s.jibam, fontWeight: 900, color: navy, letterSpacing: '0.12em', lineHeight: 1 }}>
          JIBAM
        </span>
        <span style={{ fontSize: s.pharmacy, fontWeight: 800, color: cyan, letterSpacing: '0.18em', lineHeight: 1.1 }}>
          PHARMACY
        </span>
      </div>
    );
  }

  // Full logo
  return (
    <div className={`flex items-center gap-${Math.round(s.gap / 4)} ${className}`} style={{ gap: s.gap }}>
      <ShieldSVG size={s.shield} navy={navy} cyan={cyan} />
      <div className="flex flex-col leading-none">
        <span
          style={{
            fontSize: s.rc,
            fontWeight: 700,
            color: rcClr,
            letterSpacing: '0.05em',
            lineHeight: 1,
            marginBottom: 2,
            textAlign: 'right',
          }}
        >
          RC: 1948976
        </span>
        <span
          style={{
            fontSize: s.jibam,
            fontWeight: 900,
            color: navy,
            letterSpacing: '0.12em',
            lineHeight: 1,
          }}
        >
          JIBAM
        </span>
        <span
          style={{
            fontSize: s.pharmacy,
            fontWeight: 800,
            color: cyan,
            letterSpacing: '0.20em',
            lineHeight: 1.15,
          }}
        >
          PHARMACY
        </span>
      </div>
    </div>
  );
}
