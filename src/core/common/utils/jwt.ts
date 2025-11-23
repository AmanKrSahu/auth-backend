import type { SignOptions, VerifyOptions } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';

import { config } from '../../config/app.config';

export type AccessTPayload = {
  userId: string;
  sessionId: string;
};

export type RefreshTPayload = {
  sessionId: string;
};

export type ResetTPayload = {
  email: string;
  purpose: 'PASSWORD_RESET';
};

type SignOptsAndSecret = SignOptions & {
  secret: string;
};

const defaults: SignOptions & VerifyOptions = {
  audience: 'user',
};

export const accessTokenSignOptions: SignOptsAndSecret = {
  expiresIn: config.JWT.EXPIRES_IN as SignOptions['expiresIn'],
  secret: config.JWT.SECRET,
};

export const refreshTokenSignOptions: SignOptsAndSecret = {
  expiresIn: config.JWT.REFRESH_EXPIRES_IN as SignOptions['expiresIn'],
  secret: config.JWT.REFRESH_SECRET,
};

export const resetTokenSignOptions: SignOptsAndSecret = {
  expiresIn: '10m',
  secret: config.JWT.RESET_SECRET,
};

export const signJwtToken = (
  payload: AccessTPayload | RefreshTPayload | ResetTPayload,
  options?: SignOptsAndSecret
) => {
  const { secret, ...opts } = options ?? accessTokenSignOptions;
  return jwt.sign(payload, secret, {
    ...defaults,
    ...opts,
  });
};

export const verifyJwtToken = <TPayload extends object = AccessTPayload>(
  token: string,
  options?: VerifyOptions & { secret: string }
) => {
  try {
    const { secret = config.JWT.SECRET, ...opts } = options ?? {};
    const payload = jwt.verify(token, secret, {
      ...defaults,
      ...opts,
    }) as unknown as TPayload;
    return { payload };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};
