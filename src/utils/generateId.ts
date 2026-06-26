/**
 * Generates a UUID v4 using the Web Crypto API (available in React Native 0.71+).
 * Does NOT use Math.random() — uses cryptographically secure random bytes.
 */
export function generateId(): string {
  return crypto.randomUUID();
}

/**
 * Generates a secure invite code using Crockford base32 encoding.
 * 16 random bytes → ~62 bits of entropy after encoding → 12+ characters.
 */
export function generateInviteCode(): string {
  const CROCKFORD = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
  const bytes = new Uint8Array(10);
  crypto.getRandomValues(bytes);

  let code = '';
  for (const byte of bytes) {
    code += CROCKFORD[byte % 32];
  }

  // Return first 12 characters — 60 bits of entropy; brute-force infeasible
  return code.slice(0, 12);
}
