import { RateLimitsByWindow } from './interfaces/rate-limits-by-window.interface';

export const RATE_LIMITS_FOR_USERS_CREATE: RateLimitsByWindow = {
  short: { ttl: 1000, limit: 1 },
  medium: { ttl: 60000, limit: 5 },
  long: { ttl: 3600000, limit: 10 },
};
