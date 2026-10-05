const passport = require("./passportGame");

const optionalJwt = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) return next(err);

    req.user = user || null; // null if token is invalid
    next();
  })(req, res, next);
};

module.exports = optionalJwt;
