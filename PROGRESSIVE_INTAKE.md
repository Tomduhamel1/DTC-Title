# Progressive Intake Implementation

Complete implementation of a progressive intake form with auto-save, magic link resume, file uploads, and comprehensive activity logging.

## Features

- **Auto-Save Progress**: Saves form data automatically as users fill it out
- **Completion Tracking**: Calculates and displays completion percentage (0-100%)
- **Magic Link Resume**: Generates secure tokens for users to resume later via `/resume/[token]`
- **File Uploads**: S3-based document uploads with signed URLs
- **Activity Logging**: Tracks `intake_started`, `intake_updated`, `doc_uploaded` events
- **Progressive Steps**: 5-step form (Contact → Address → Property → Financial → Documents)
- **Validation**: Real-time validation with helpful error messages

## Architecture

```
User fills form → Auto-save (debounced) → Update Lead.intakeJson + completion%
                        ↓
                  Generate resume token → Store in DB with expiration
                        ↓
                  Show magic link → User can resume anytime
                        ↓
                  Upload documents → S3 via signed URLs → Log activity
```

## Database Schema

### Lead Model Updates

```prisma
model Lead {
  // ... existing fields

  // Progressive intake
  intakeJson           Json?     // Partial intake form data
  completionPercentage Int?      @default(0) // 0-100
  resumeToken          String?   @unique // Magic link token
  tokenExpiresAt       DateTime? // Token expiration (7 days)

  documents  Document[] // Uploaded files
}
```

### New Document Model

```prisma
model Document {
  id        String   @id @default(cuid())
  leadId    String
  lead      Lead     @relation(...)

  type      String   // pay_stub, bank_statement, tax_return, id_document
  fileName  String
  fileSize  Int      // bytes
  mimeType  String
  s3Key     String   // S3 object key
  s3Url     String   // S3 URL

  uploadedBy String?  // user or admin
  notes      String?

  createdAt DateTime @default(now())
}
```

### Activity Events

```typescript
// intake_started - When user first fills email
{
  type: 'intake_started',
  action: 'Started progressive intake',
  metadata: {
    completionPercentage: 20,
    email: 'user@example.com'
  }
}

// intake_updated - When progress is auto-saved
{
  type: 'intake_updated',
  action: 'Updated progressive intake',
  metadata: {
    completionPercentage: 60,
    previousCompletion: 40
  }
}

// doc_uploaded - When document is uploaded
{
  type: 'doc_uploaded',
  action: 'Uploaded pay_stub',
  metadata: {
    documentId: 'doc123',
    fileName: 'paystub.pdf',
    fileSize: 245678,
    documentType: 'pay_stub'
  }
}
```

## File Structure

```
src/
├── app/
│   ├── api/
│   │   └── intake/
│   │       ├── save/
│   │       │   └── route.ts              # Auto-save API
│   │       └── upload/
│   │           ├── route.ts              # Generate upload URL
│   │           └── confirm/
│   │               └── route.ts          # Confirm upload
│   ├── resume/
│   │   └── [token]/
│   │       └── page.tsx                  # Magic link handler
│   └── start/
│       └── page.tsx                      # Progressive intake form
├── components/
│   └── FileUpload.tsx                    # File upload component
└── lib/
    ├── aws/
    │   └── upload.ts                     # S3 upload utilities
    └── intake/
        ├── token.ts                      # Token generation
        └── progress.ts                   # Completion calculation
```

## API Endpoints

### POST /api/intake/save

Auto-save intake progress.

**Request:**
```json
{
  "email": "john@example.com",
  "data": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "555-123-4567",
    "address": "123 Main St",
    ...
  },
  "resumeToken": "optional-existing-token"
}
```

**Response:**
```json
{
  "success": true,
  "leadId": "clx123abc",
  "completionPercentage": 60,
  "resumeToken": "abc123def456...",
  "resumeUrl": "https://example.com/resume/abc123def456...",
  "isNew": false
}
```

### POST /api/intake/upload

Generate presigned S3 upload URL.

**Request:**
```json
{
  "leadId": "clx123abc",
  "fileName": "paystub.pdf",
  "fileSize": 245678,
  "fileType": "application/pdf",
  "documentType": "pay_stub"
}
```

**Response:**
```json
{
  "success": true,
  "uploadUrl": "https://s3.amazonaws.com/...",
  "key": "leads/clx123abc/pay_stub/1234567890-abc123-paystub.pdf",
  "expiresIn": 300
}
```

### POST /api/intake/upload/confirm

Confirm successful upload and save to database.

**Request:**
```json
{
  "leadId": "clx123abc",
  "key": "leads/clx123abc/pay_stub/...",
  "fileName": "paystub.pdf",
  "fileSize": 245678,
  "fileType": "application/pdf",
  "documentType": "pay_stub"
}
```

**Response:**
```json
{
  "success": true,
  "document": {
    "id": "doc123",
    "type": "pay_stub",
    "fileName": "paystub.pdf",
    "s3Url": "https://..."
  }
}
```

## Usage

### User Flow

1. **Start Application** (`/start`)
   - User fills in email
   - Auto-save triggers → Lead created
   - Resume token generated
   - Magic link shown

2. **Progress Tracking**
   - Each field update triggers auto-save (debounced 1 second)
   - Completion percentage calculated
   - Progress bar updates in real-time
   - "Progress saved" message appears

3. **Resume Later** (`/resume/[token]`)
   - User clicks magic link
   - Token validated
   - Saved data loaded
   - User continues where they left off

4. **Upload Documents**
   - User reaches documents step
   - Files upload directly to S3
   - Document records saved
   - Activities logged

### Magic Link Example

```
https://gardendtc.com/resume/abc123def456789012345678901234567890123456789012345678901234
```

Token format: 64 hex characters, expires in 7 days

### File Upload Flow

```
1. User selects file
2. Frontend: POST /api/intake/upload → Get presigned URL
3. Frontend: PUT to S3 URL → Upload file
4. Frontend: POST /api/intake/upload/confirm → Save to DB
5. Backend: Log doc_uploaded activity
```

## Completion Percentage Calculation

Tracks 13 required fields across 4 sections:

```typescript
const INTAKE_FIELDS = {
  contact: ['firstName', 'lastName', 'email', 'phone'],      // 4 fields
  address: ['address', 'city', 'state', 'zipCode'],          // 4 fields
  property: ['propertyType', 'homeValue'],                   // 2 fields
  financial: ['mortgageBalance', 'currentRate', 'creditScore'] // 3 fields
}

// Total: 13 fields
// Completion = (filled fields / 13) * 100
```

Examples:
- Email only: 7% (1/13)
- All contact info: 31% (4/13)
- Contact + Address: 62% (8/13)
- All required fields: 100% (13/13)

## File Upload Specs

### Allowed File Types

- PDF: `.pdf`
- Images: `.jpg`, `.jpeg`, `.png`, `.gif`
- Word: `.doc`, `.docx`
- Excel: `.xls`, `.xlsx`

### File Size Limit

- Maximum: 10 MB per file
- Enforced both client-side and server-side

### Document Types

- `pay_stub` - Recent Pay Stub
- `bank_statement` - Bank Statement
- `tax_return` - Tax Return
- `id_document` - Photo ID

### S3 Organization

```
garden-dtc-quotes/
└── leads/
    └── {leadId}/
        ├── pay_stub/
        │   └── {timestamp}-{random}-{filename}
        ├── bank_statement/
        ├── tax_return/
        └── id_document/
```

## Security

### Token Security

- **64 hex characters** (256 bits entropy)
- **Cryptographically secure** random generation
- **7-day expiration** (configurable)
- **Single-use recommended** (can regenerate on each save)
- **Unique index** in database

### Upload Security

- **Presigned URLs** with 5-minute expiration
- **Server-side validation** of file type and size
- **Encrypted storage** (S3 AES256)
- **Private bucket** with signed URLs (optional)
- **Virus scanning** (recommended for production)

## Error Handling

### Auto-Save Failures

- Silent failure (non-blocking)
- Console logging for debugging
- User can continue filling form
- Retry on next change

### Upload Failures

- Clear error messages to user
- Validation before upload attempt
- S3 errors caught and displayed
- User can retry upload

### Token Expiration

- Graceful degradation
- Shows "Link Expired" page
- Offers to continue with saved data
- Generates new token on continue

## Setup

### 1. Update Database

```bash
npm run db:generate
npm run db:push
```

### 2. Configure AWS (Already Done)

S3 bucket and credentials already configured for PDF generation.

### 3. Test Locally

```bash
npm run dev
```

Visit `http://localhost:3000/start`

## Testing

### Test Auto-Save

1. Visit `/start`
2. Enter email address
3. Fill other fields
4. Check console for "Progress saved" logs
5. Verify database: `npm run db:studio`
   - Check `Lead.intakeJson`
   - Check `Lead.completionPercentage`
   - Check `Lead.resumeToken`

### Test Magic Link

1. Complete some fields at `/start`
2. Copy the magic link shown
3. Open in new tab/incognito
4. Verify form is pre-filled
5. Check `ActivityEvent` for resume log

### Test File Upload

1. Complete first 4 steps
2. Reach documents step
3. Select a PDF file
4. Watch upload progress
5. Verify:
   - File appears in S3
   - `Document` record created
   - `ActivityEvent` logged

### Mock S3 for Local Testing

```typescript
// For local dev without AWS
if (process.env.NODE_ENV === 'development') {
  // Mock upload
  return {
    uploadUrl: 'http://localhost:3000/mock-upload',
    key: 'mock-key.pdf',
    expiresIn: 300
  }
}
```

## Integration Examples

### React Component Usage

```tsx
import FileUpload from '@/components/FileUpload'

<FileUpload
  leadId={leadId}
  documentType="pay_stub"
  label="Recent Pay Stub"
  onSuccess={(document) => {
    console.log('Uploaded:', document)
    // Update UI, show success message
  }}
  onError={(error) => {
    console.error('Upload failed:', error)
    // Show error message
  }}
/>
```

### Check Intake Progress

```typescript
const lead = await prisma.lead.findUnique({
  where: { email: 'user@example.com' },
  include: { documents: true }
})

console.log('Completion:', lead.completionPercentage, '%')
console.log('Documents:', lead.documents.length)
console.log('Resume link:', `/resume/${lead.resumeToken}`)
```

### View Activities

```typescript
const activities = await prisma.activityEvent.findMany({
  where: {
    leadId: lead.id,
    type: { in: ['intake_started', 'intake_updated', 'doc_uploaded'] }
  },
  orderBy: { createdAt: 'desc' }
})
```

## Performance

- **Auto-save debounce**: 1 second (configurable)
- **File upload**: Direct to S3 (no server proxy)
- **Presigned URL TTL**: 5 minutes
- **Token expiration**: 7 days
- **Database updates**: Optimized with indexes

## Best Practices

1. **Always validate email first** before enabling auto-save
2. **Show progress indicators** for uploads
3. **Handle token expiration gracefully**
4. **Log all significant events**
5. **Validate file types server-side**
6. **Set reasonable file size limits**
7. **Use unique S3 keys** to prevent overwriting
8. **Monitor upload failures**

## Future Enhancements

- [ ] Email magic links automatically
- [ ] SMS magic links
- [ ] Auto-send reminders for incomplete applications
- [ ] Document OCR for data extraction
- [ ] Bulk document upload
- [ ] Document preview
- [ ] Drag-and-drop upload
- [ ] Resume from any page (not just /start)
- [ ] Progressive disclosure (hide steps until needed)
- [ ] Analytics on drop-off points

## Troubleshooting

### "Progress saved" not showing
- Check email field is filled
- Check console for errors
- Verify `/api/intake/save` is reachable

### Upload fails
- Check file size < 10MB
- Check file type is allowed
- Verify AWS credentials
- Check S3 bucket CORS settings

### Magic link doesn't work
- Verify token hasn't expired (7 days)
- Check token format (64 hex chars)
- Verify lead exists with that token

### Completion percentage stuck
- Check all field names match `INTAKE_FIELDS`
- Verify auto-save is working
- Check `Lead.intakeJson` in database

## Support

For issues or questions:
- Check browser console for errors
- Verify database schema is up to date
- Check Activity Events for diagnostic info
- Review server logs for API errors

## Summary

✅ Auto-save with debouncing
✅ Completion percentage tracking
✅ Magic link resume tokens
✅ S3 file uploads with signed URLs
✅ Comprehensive activity logging
✅ Production-ready error handling
✅ Secure token generation
✅ File validation and limits

All requirements met! 🎉
