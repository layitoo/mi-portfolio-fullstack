export default function ChromeStar({ className = "w-16 h-16", size = 64 }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="chromeGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="35%" stopColor="#d1d5db" />
          <stop offset="65%" stopColor="#4b5563" />
          <stop offset="100%" stopColor="#111827" />
        </linearGradient>
        <linearGradient id="chromeGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#9ca3af" />
          <stop offset="70%" stopColor="#1f2937" />
          <stop offset="100%" stopColor="#000000" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Outer 4-point chrome star */}
      <path
        d="M50 0 C50 30 70 50 100 50 C70 50 50 70 50 100 C50 70 30 50 0 50 C30 50 50 30 50 0 Z"
        fill="url(#chromeGrad1)"
        stroke="rgba(255,255,255,0.7)"
        strokeWidth="1"
        filter="url(#glow)"
      />
      {/* Specular inner bevel light */}
      <path
        d="M50 12 C50 35 65 50 88 50 C65 50 50 65 50 88 C50 65 35 50 12 50 C35 50 50 35 50 12 Z"
        fill="url(#chromeGrad2)"
        opacity="0.9"
      />
      <circle cx="50" cy="50" r="3" fill="#ffffff" filter="url(#glow)" />
    </svg>
  );
}
