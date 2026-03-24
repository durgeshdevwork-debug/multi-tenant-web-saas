import crypto from 'crypto';

export const generateApiKey = (): { apiKey: string; apiKeyHash: string; truncatedApiKey: string } => {
  // Generate a random 32-byte key
  const apiKeyBytes = crypto.randomBytes(32).toString('hex');
  const apiKey = `sk_${apiKeyBytes}`; // simple prefix
  
  // Hash the key using SHA-256 for safe database storage
  const apiKeyHash = crypto.createHash('sha256').update(apiKey).digest('hex');
  
  // Create a truncated version for UI display
  // e.g., sk_abcd...1234
  const prefix = apiKey.substring(0, 7); // sk_abcd
  const suffix = apiKey.slice(-4);
  const truncatedApiKey = `${prefix}...${suffix}`;

  return { apiKey, apiKeyHash, truncatedApiKey };
};

export const hashApiKey = (apiKey: string): string => {
  return crypto.createHash('sha256').update(apiKey).digest('hex');
};
