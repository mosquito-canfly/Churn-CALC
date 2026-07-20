// Shared mailto: link builder — the only "send" path in the app (no email backend).
// Recipient is left unencoded per RFC 6068 addr-spec convention; subject/body are
// percent-encoded query params.
export function buildMailtoHref(email: string, subject: string, body: string): string {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
