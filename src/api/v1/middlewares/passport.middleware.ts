import { setupJwtStrategy } from '@core/common/strategies/jwt.strategy';
import passport from 'passport';

const intializePassport = () => {
  setupJwtStrategy(passport);
};

intializePassport();

export { default } from 'passport';
