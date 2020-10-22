const config = require('../config');
const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(new TwitterStrategy({
    consumerKey: config.twitter.consumerKey,
    consumerSecret: config.twitter.consumerSecret,
    callbackURL: `${config.url}/auth/twitter/callback`
  },
  (token, tokenSecret, profile, done) => {
    passport.session.id = profile.id;
    profile.oauth_token = token;
    profile.oauth_token_secret = tokenSecret;
    process.nextTick(() => {
      return done(null, profile);
    });
  }
));

passport.use(new FacebookStrategy({
    clientID: config.facebook.appId,
    clientSecret: config.facebook.appSecret,
    callbackURL: `${config.url}/auth/facebook/callback`,
    profileFields: ['id']
  },
  (accessToken, refreshToken, params, profile, done) => {
    passport.session.id = profile.id;
    profile.access_token = accessToken;
    profile.expiration_date = {
      '__type': 'Date',
      'iso': (new Date((new Date()).getTime() + params.expires_in * 1000)).toISOString()
    }
    process.nextTick(() => {
      return done(null, profile);
    });
  })
);

passport.use(new GoogleStrategy({
    clientID: config.google.clientId,
    clientSecret: config.google.clientSecret,
    callbackURL: `${config.url}/auth/google/callback`
  }, function(accessToken, refreshToken, params, profile, done){
    profile.access_token = params.access_token;
    process.nextTick(() => {
      return done(null, profile);
    });
  }
));

export default passport;
