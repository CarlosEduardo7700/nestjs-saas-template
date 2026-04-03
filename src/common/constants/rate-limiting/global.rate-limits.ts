import { RateLimitConfig } from './interfaces/rate-limit-config.interface';

export const GLOBAL_RATE_LIMIT: RateLimitConfig[] = [
  {
    name: 'short',
    ttl: 1000,
    limit: 3,
  },
  {
    name: 'medium',
    ttl: 10000,
    limit: 20,
  },
  {
    name: 'long',
    ttl: 60000,
    limit: 100,
  },
];
