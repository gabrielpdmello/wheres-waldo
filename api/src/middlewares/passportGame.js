const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const game = require("../models/game");
const passport = require("passport");

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_KEY,
  passReqToCallback: true,
};

passport.use(
  new JwtStrategy(opts, async (req, jwt_payload, done) => {
    const gameId = jwt_payload.gameId;
    const foundGame = await game.getGameById(gameId);
    if (foundGame) {
      return done(null, gameId);
    }
    return done(null, false);
  }),
);

module.exports = passport;
