const config = require('../config');
const passport = require('passport');
const path = require('path');
const TwitterStrategy = require('passport-twitter').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const AppleStrategy = require('passport-apple');

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
    profile.oauth_consumer_key = config.twitter.consumerKey;
    profile.consumer_secret = config.twitter.consumerSecret;
    profile.screen_name = profile.username;
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

passport.use(new AppleStrategy({
    clientID: config.apple.clientId,
    teamID: config.apple.teamId,
    callbackURL: `${config.url}/auth/apple/callback`,
    keyID: config.apple.keyId,
    privateKeyLocation: path.join(__dirname, config.apple.key),
    passReqToCallback: true
}, function(req, accessToken, refreshToken, decodedIdToken, profile, done) {
  const params = {
    provider: 'apple',
    id: decodedIdToken.sub,
    access_token: accessToken,
    client_id: config.apple.appId
  }
  process.nextTick(() => {
    return done(null, params);
  });
}));

export default passport;
