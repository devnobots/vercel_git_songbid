export default function TipIcon({ className = "" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" className={className}>
      {/* Green background rectangle */}
      <rect x="0" y="0" width="24" height="24" rx="3" ry="3" fill="#22c55e" />

      {/* Money icon in white lines */}
      <g stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* Circle with dollar sign */}
        <circle cx="12" cy="8" r="4" />

        {/* Dollar sign */}
        <path d="M12 6v4M10.5 8h3" />

        {/* Box below */}
        <rect x="6" y="12" width="12" height="8" />

        {/* Horizontal line */}
        <line x1="6" y1="16" x2="18" y2="16" />

        {/* Line below circle */}
        <line x1="6" y1="12" x2="18" y2="12" />
      </g>
    </svg>
  )
}
