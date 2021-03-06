const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');
const User = require('../models/users');
const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  })
});

passport.use(
  new GoogleStrategy({
      // options for google strategy
      clientID: clientId,
      clientSecret: clientSecret,
      callbackURL: '/auth/google/redirect'
  }, (accessToken, refreshToken, email, done) => {
      // passport callback function
      console.log('passport callback function created:');
      User.findOne({googleid: email.id}).then((currentUser) => {

        if (currentUser) {
          console.log('already a user');
          done(null, currentUser);
        } else {
          new User({
            username: email.displayName,
            googleid: email.id,
            email: email.emails[0].value,
            routes: []
          }).save().then((newUser) => {
            console.log(newUser);
            done(null, newUser);
          });
        }
      })
  })
);
