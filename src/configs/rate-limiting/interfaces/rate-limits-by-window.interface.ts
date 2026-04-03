export interface RateLimitsByWindow {
  [key: string]: {
    ttl: number;
    limit: number;
  };
}
