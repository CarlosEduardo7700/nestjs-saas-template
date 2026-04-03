import { RateLimitsByWindow } from './interfaces/rate-limits-by-window.interface';

export const RATE_LIMITS_FOR_AUTH_LOGIN: RateLimitsByWindow = {
  short: { ttl: 1000, limit: 1 },
  medium: { ttl: 60000, limit: 5 },
  long: { ttl: 3600000, limit: 20 },
};

export const RATE_LIMITS_FOR_AUTH_FORGOT_PASSWORD: RateLimitsByWindow = {
  short: { ttl: 1000, limit: 1 },
  medium: { ttl: 60000, limit: 3 },
  long: { ttl: 3600000, limit: 5 },
};

export const RATE_LIMITS_FOR_AUTH_RESET_PASSWORD: RateLimitsByWindow = {
  short: { ttl: 1000, limit: 1 },
  medium: { ttl: 60000, limit: 5 },
  long: { ttl: 3600000, limit: 10 },
};
