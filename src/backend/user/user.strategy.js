const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const User = require("./user.pg.model");

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
    }, async function(payload, done) {
        try {
            const user = await User.findByPk(payload.id);

            if(user) return done(null, user);

            return done(null, false);
        } catch(err) {
            done(err, false);
        }
    }));
};
