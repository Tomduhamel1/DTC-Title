'use client'

import { useState } from 'react'

interface MuteToggleProps {
  membershipId: string
  initialMuted: boolean
}

// Per-client mute toggle for the teammate dashboard. PATCHes the
// /api/teammate/closings/[id]/mute endpoint optimistically, falling back
// to the previous state on failure.

export default function MuteToggle({ membershipId, initialMuted }: MuteToggleProps) {
  const [muted, setMuted] = useState(initialMuted)
  const [busy, setBusy] = useState(false)

  const onToggle = async () => {
    if (busy) return
    const next = !muted
    setBusy(true)
    setMuted(next)
    try {
      const res = await fetch(`/api/teammate/closings/${membershipId}/mute`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ muted: next }),
      })
      if (!res.ok) throw new Error('mute failed')
    } catch {
      setMuted(!next)
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      onClick={onToggle}
      title={muted ? 'Unmute updates for this client' : 'Mute updates for this client'}
      className={`text-xs font-semibold px-3 py-2 rounded-lg border transition-colors ${
        muted
          ? 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
      } ${busy ? 'opacity-60 cursor-wait' : ''}`}
    >
      {muted ? '🔕 Muted' : '🔔 Subscribed'}
    </button>
  )
}
