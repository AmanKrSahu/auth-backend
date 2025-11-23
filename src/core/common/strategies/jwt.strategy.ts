import type { PassportStatic } from 'passport';
import passport from 'passport';
import type { StrategyOptionsWithRequest } from 'passport-jwt';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';

import { config } from '../../config/app.config';
import prisma from '../../database/prisma';
import { ErrorCodeEnum } from '../enums/error-code.enum';
import { UnauthorizedException } from '../utils/app-error';

interface JwtPayload {
  userId: string;
  sessionId: string;
}

const options: StrategyOptionsWithRequest = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    req => {
      const accessToken = req.cookies.accessToken;

      if (!accessToken) {
        throw new UnauthorizedException(
          'Unauthorized access token',
          ErrorCodeEnum.AUTH_TOKEN_NOT_FOUND
        );
      }

      return accessToken;
    },
  ]),
  secretOrKey: config.JWT.SECRET,
  audience: ['user'],
  algorithms: ['HS256'],
  passReqToCallback: true,
};

export const setupJwtStrategy = (passport: PassportStatic) => {
  passport.use(
    new JwtStrategy(options, async (req, payload: JwtPayload, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: { id: payload.userId },
          include: { sessions: true },
        });

        if (!user) {
          return done(null, false);
        }

        const session = user.sessions.find(s => s.id === payload.sessionId);
        if (!session || session.expiresAt < new Date()) {
          return done(null, false);
        }

        req.sessionId = payload.sessionId;

        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    })
  );
};

export const authenticateJWT = passport.authenticate('jwt', { session: false });
