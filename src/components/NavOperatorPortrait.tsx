// The nav needs the original operator's face-and-headset framing, not the
// broader portrait used elsewhere. Clip the enlarged image without scaling
// the 64px layout box or the separate phone badge.
export default function NavOperatorPortrait() {
  return (
    <span className="block w-16 h-16 shrink-0 overflow-hidden rounded-full bg-white border-3 border-primary-400 shadow-lg">
      <img
        src="/images/marketing/nicole-operator-v1.webp"
        alt="Nicole — BetterClose support"
        width={64}
        height={64}
        className="block w-full h-full object-cover origin-top scale-150"
      />
    </span>
  )
}
