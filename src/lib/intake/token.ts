import crypto from 'crypto'

/**
 * Generate a secure random token for magic links
 */
export function generateResumeToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Get token expiration date (7 days from now by default)
 */
export function getTokenExpiration(daysValid: number = 7): Date {
  const expiration = new Date()
  expiration.setDate(expiration.getDate() + daysValid)
  return expiration
}

/**
 * Check if a token is expired
 */
export function isTokenExpired(expiresAt: Date | null): boolean {
  if (!expiresAt) return true
  return new Date() > expiresAt
}

/**
 * Validate a resume token
 */
export function validateToken(token: string): boolean {
  // Check token format (64 hex characters)
  return /^[a-f0-9]{64}$/.test(token)
}
