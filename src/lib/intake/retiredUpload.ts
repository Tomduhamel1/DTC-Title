import { NextResponse } from 'next/server'

// Deliberately independent of request bodies, sessions, the database and storage.
export function retiredIntakeUpload() {
  return NextResponse.json(
    {
      success: false,
      code: 'INTAKE_UPLOAD_RETIRED',
      error: 'Upload documents from the Documents section of your closing file.',
      nextUrl: '/dashboard',
    },
    { status: 410, headers: { 'Cache-Control': 'no-store' } }
  )
}
