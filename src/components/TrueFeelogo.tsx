export default function TrueFeelogo({ className = "h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 180 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Icon - House with checkmark */}
      <g>
        <path
          d="M8 20L20 8L32 20V34C32 35.1046 31.1046 36 30 36H10C8.89543 36 8 35.1046 8 34V20Z"
          fill="#0693e3"
          stroke="#0693e3"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14 24L18 28L26 18"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* Text - "BetterClose" */}
      <text x="42" y="25" fontFamily="system-ui, -apple-system, sans-serif" fontSize="22" fontWeight="700" fill="#0693e3" letterSpacing="-0.5" dominantBaseline="middle">
        BetterClose
      </text>
    </svg>
  )
}
