export type StepStatus = 'done' | 'active' | 'pending'

export default function StatusNode({ status }: { status: StepStatus }) {
  if (status === 'done') {
    return (
      <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center ring-4 ring-white shadow-sm">
        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    )
  }
  if (status === 'active') {
    return (
      <div className="w-5 h-5 rounded-full bg-white border-2 border-emerald-500 flex items-center justify-center ring-4 ring-white">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      </div>
    )
  }
  return (
    <div className="w-5 h-5 rounded-full bg-white border-2 border-gray-300 ring-4 ring-white" />
  )
}
