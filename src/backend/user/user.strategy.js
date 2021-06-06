const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const User = require("./user.model");

module.exports = function() {
    function cookieExtractor(req) {
        let token;
        if (req && req.signedCookies) {
            token = req.signedCookies["access_token"];
        }
        return token;
    }

    passport.use(new JwtStrategy({
        secretOrKey: process.env.ACCESS_TOKEN_SECRET,
        jwtFromRequest: cookieExtractor
    }, function(payload, done) {
        User.findById(payload.id, function(err, user) {
            if(err) return done(err, false);

            if(user) return done(null, user);

            return done(null, false);
        });
    }));
};
