// Single source of truth for BetterClose's user-visible support phone number.
//
// TODO(launch): replace the placeholder values below with the real BetterClose
// support line, then this one edit propagates to every surface (homepage trust
// section, quote-results availability strip, dashboard contact rail, and the
// closing-welcome email). Until then we ship a clearly-placeholder number so no
// fake "555" vanity number reaches users.
//
// SUPPORT_PHONE_DISPLAY is the human-readable string shown in the UI/email.
// SUPPORT_PHONE_TEL is the digits-only tel: target (no formatting, no leading
// "tel:" — callers add the scheme). It is intentionally EMPTY until the real
// number lands: callers must only render a tel: link when it is non-empty, so
// production never ships a fake dialable number.
export const SUPPORT_PHONE_DISPLAY = '[SUPPORT PHONE TBD]'
export const SUPPORT_PHONE_TEL = ''
