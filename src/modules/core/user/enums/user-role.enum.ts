export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export const DEFAULT_ROLE: UserRole = UserRole.USER;

export const MODERATOR_ROLES: UserRole[] = [UserRole.ADMIN];

export function defineRole(): UserRole {
  return DEFAULT_ROLE;
}
