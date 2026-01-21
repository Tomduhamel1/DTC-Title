/**
 * Intake form field definitions
 */
export const INTAKE_FIELDS = {
  contact: ['firstName', 'lastName', 'email', 'phone'],
  address: ['address', 'city', 'state', 'zipCode'],
  property: ['propertyType', 'homeValue'],
  financial: ['mortgageBalance', 'currentRate', 'creditScore'],
} as const

export type IntakeSection = keyof typeof INTAKE_FIELDS
export type IntakeData = Record<string, any>

/**
 * Calculate completion percentage based on filled fields
 */
export function calculateCompletionPercentage(data: IntakeData): number {
  const allFields = Object.values(INTAKE_FIELDS).flat()
  const filledFields = allFields.filter((field) => {
    const value = data[field]
    return value !== undefined && value !== null && value !== ''
  })

  return Math.round((filledFields.length / allFields.length) * 100)
}

/**
 * Get completed sections
 */
export function getCompletedSections(data: IntakeData): IntakeSection[] {
  return Object.entries(INTAKE_FIELDS)
    .filter(([_, fields]) => {
      return fields.every((field) => {
        const value = data[field]
        return value !== undefined && value !== null && value !== ''
      })
    })
    .map(([section]) => section as IntakeSection)
}

/**
 * Get next incomplete section
 */
export function getNextIncompleteSection(data: IntakeData): IntakeSection | null {
  const sections: IntakeSection[] = ['contact', 'address', 'property', 'financial']

  for (const section of sections) {
    const fields = INTAKE_FIELDS[section]
    const isComplete = fields.every((field) => {
      const value = data[field]
      return value !== undefined && value !== null && value !== ''
    })

    if (!isComplete) {
      return section
    }
  }

  return null
}

/**
 * Validate section data
 */
export function validateSection(section: IntakeSection, data: IntakeData): {
  valid: boolean
  errors: Record<string, string>
} {
  const errors: Record<string, string> = {}
  const fields = INTAKE_FIELDS[section]

  fields.forEach((field) => {
    const value = data[field]

    if (!value || value === '') {
      errors[field] = 'This field is required'
      return
    }

    // Email validation
    if (field === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errors[field] = 'Invalid email address'
    }

    // Phone validation
    if (field === 'phone' && !/^\d{10,}$/.test(value.replace(/\D/g, ''))) {
      errors[field] = 'Invalid phone number'
    }

    // Numeric validations
    if (['homeValue', 'mortgageBalance', 'currentRate'].includes(field)) {
      const num = parseFloat(value)
      if (isNaN(num) || num <= 0) {
        errors[field] = 'Must be a positive number'
      }
    }

    // State validation
    if (field === 'state' && value.length !== 2) {
      errors[field] = 'Must be a 2-letter state code'
    }

    // ZIP code validation
    if (field === 'zipCode' && !/^\d{5}(-\d{4})?$/.test(value)) {
      errors[field] = 'Invalid ZIP code'
    }
  })

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Merge partial intake data
 */
export function mergeIntakeData(existing: IntakeData, updates: IntakeData): IntakeData {
  return {
    ...existing,
    ...updates,
  }
}
