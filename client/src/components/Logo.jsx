const Logo = ({ size = 40, showWordmark = true, wordmarkClass = "" }) => {
  return (
    <span className="inline-flex items-center gap-3">
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-none drop-shadow-[0_0_12px_rgba(13,148,136,0.45)]"
        aria-label="ClassTrack logo"
      >
        <defs>
          <linearGradient id="ct-logo-grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#0D9488" />
            <stop offset="1" stopColor="#F59E0B" />
          </linearGradient>
        </defs>
        <rect x="4" y="4" width="56" height="56" rx="16" fill="#0A0F1A" />
        <rect x="4" y="4" width="56" height="56" rx="16" fill="url(#ct-logo-grad)" opacity="0.12" />
        <g stroke="url(#ct-logo-grad)" strokeWidth="4" strokeLinecap="round">
          <path d="M14 24 V16 a4 4 0 0 1 4-4 h8" />
          <path d="M42 12 h8 a4 4 0 0 1 4 4 v8" />
          <path d="M50 40 v8 a4 4 0 0 1-4 4 h-8" />
          <path d="M22 52 h-8 a4 4 0 0 1-4-4 v-8" />
        </g>
        <path
          d="M24 32.5 l7 7 L41 28"
          stroke="url(#ct-logo-grad)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {showWordmark && (
        <span className={`font-display text-xl font-bold tracking-tight text-white ${wordmarkClass}`}>
          Class<span className="bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">Track</span>
        </span>
      )}
    </span>
  );
};

export default Logo;
