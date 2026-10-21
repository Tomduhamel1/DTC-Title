import { retiredIntakeUpload } from '@/lib/intake/retiredUpload'

// Retired confirmations must not create documents, even for an earlier upload.
export async function POST() {
  return retiredIntakeUpload()
}
