const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('User');

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/api/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const existingUser = await User.findOne({ googleId: profile.id });

                if (existingUser) {
                    return done(null, existingUser);
                }

                const user = new User({ googleId: profile.id, email: profile.emails[0].value, username: profile.displayName });
                await user.save();
                done(null, user);
            } catch (error) {
                done(error, null);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id); // Serialize the user ID to the session
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id); // Find the user by ID from the session
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});
