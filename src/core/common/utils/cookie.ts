import type { CookieOptions, Response } from 'express';

import { config } from '../../config/app.config';
import { calculateExpirationDate } from './date-time';

type AuthCookiePayloadType = {
  res: Response;
  accessToken: string;
  refreshToken: string;
};

type ResetCookiePayloadType = {
  res: Response;
  resetToken: string;
};

const defaults: CookieOptions = {
  httpOnly: true,
  secure: config.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  domain: config.DOMAIN_URL,
};

export const getRefreshTokenCookieOptions = (): CookieOptions => {
  const expiresIn = config.JWT.REFRESH_EXPIRES_IN;
  const expires = calculateExpirationDate(expiresIn);

  return {
    ...defaults,
    expires,
    path: '/',
  };
};

export const getAccessTokenCookieOptions = (): CookieOptions => {
  const expiresIn = config.JWT.EXPIRES_IN;
  const expires = calculateExpirationDate(expiresIn);

  return {
    ...defaults,
    expires,
    path: '/',
  };
};

export const getResetTokenCookieOptions = (): CookieOptions => {
  const expires = calculateExpirationDate('10m');

  return {
    ...defaults,
    expires,
    path: '/',
  };
};

export const setAuthenticationCookies = ({
  res,
  accessToken,
  refreshToken,
}: AuthCookiePayloadType): Response =>
  res
    .cookie('accessToken', accessToken, getAccessTokenCookieOptions())
    .cookie('refreshToken', refreshToken, getRefreshTokenCookieOptions());

export const setResetTokenCookie = ({ res, resetToken }: ResetCookiePayloadType): Response =>
  res.cookie('resetToken', resetToken, getResetTokenCookieOptions());

export const clearAuthenticationCookies = (res: Response): Response =>
  res.clearCookie('accessToken', { path: '/' }).clearCookie('refreshToken', { path: '/' });

export const clearResetTokenCookie = (res: Response): Response =>
  res.clearCookie('resetToken', { path: '/' });
