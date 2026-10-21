import { retiredIntakeUpload } from '@/lib/intake/retiredUpload'

// Keep a tombstone for previously loaded intake forms. Never redirect a POST.
export async function POST() {
  return retiredIntakeUpload()
}
