import crypto from 'crypto';

const BASE62_CHARSET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function generateRandomReferralCode(length = 6) {
  let code = '';
  // Use crypto for cryptographically secure random numbers
  const randomBytes = crypto.randomBytes(length);
  
  for (let i = 0; i < length; i++) {
    // Map random byte (0-255) to our 62-character set
    code += BASE62_CHARSET[randomBytes[i] % BASE62_CHARSET.length];
  }
  console.log(`Generated referral code: ${code}`);
  return code;
}
