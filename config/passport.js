const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const userModel = require('../model/model-user');
require('dotenv').config();
const secret = process.env.SECRET_WORD;

const params = {
  secretOrKey: secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

passport.use(
  new Strategy(params, async (payload, done) => {
    try {
      const user = await userModel.getUserById(payload.id);
      if (!user) {
        return done(new Error('User not found'));
      }
      if (!user.token) {
        return done(null, false);
      }
      return done(null, user);
    } catch (err) {
      done(err);
    }
  }),
);
