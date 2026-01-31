import type { User } from '@prisma/client';

export const sanitizeUser = (user: User) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, twoFactorSecret, backupCodes, ...sanitizedUser } = user as User & {
    password?: string;
  };
  return sanitizedUser;
};
