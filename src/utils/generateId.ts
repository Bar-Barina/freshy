/**
 * Generates a UUID v4.
 * Uses expo-standard-web-crypto polyfill if available, falls back to
 * manual generation with Math.random (sufficient for local bed IDs).
 */
export function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Manual UUID v4 — compliant format, non-cryptographic randomness
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Generates a secure invite code using Crockford base32 encoding.
 * Uses crypto.getRandomValues when available, falls back to Math.random.
 */
export function generateInviteCode(): string {
  const CROCKFORD = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
  const bytes = new Uint8Array(10);

  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = (Math.random() * 256) | 0;
    }
  }

  let code = '';
  for (const byte of bytes) {
    code += CROCKFORD[byte % 32];
  }

  return code.slice(0, 12);
}
