import type { HTMLAttributes } from 'react'

interface SavingsCardProps extends HTMLAttributes<HTMLDivElement> {
  label: string
  amount: string
  caption: string
}

// Shared by the homepage calculator and sample quote: one savings treatment.
export default function SavingsCard({ label, amount, caption, ...props }: SavingsCardProps) {
  return (
    <div {...props} data-savings-card className="min-w-0 grid grid-rows-[1fr_auto_1fr] bg-emerald-50 border border-emerald-200 rounded-2xl py-4 px-3 text-center">
      <div className="self-end text-[10px] font-bold uppercase tracking-wider text-emerald-700 mb-1">
        {label}
      </div>
      <div data-savings-amount className="text-3xl md:text-4xl font-black text-emerald-600 tabular-nums leading-none whitespace-nowrap">
        {amount}
      </div>
      <div className="text-[11px] text-gray-500 mt-1.5">{caption}</div>
    </div>
  )
}
