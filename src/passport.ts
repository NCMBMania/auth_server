const config = require('../config');
const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;

passport.serializeUser((user, done) => {
  const params = {
    id: user.id,
    screen_name: user.username,
    oauth_token: user.twitter_token,
    oauth_token_secret: user.twitter_token_secret
  }
  done(null, JSON.stringify(params));
});
passport.deserializeUser((obj, done) => {
  done(null, JSON.parse(obj));
});

passport.use(new TwitterStrategy({
    consumerKey: config.twitter.consumerKey,
    consumerSecret: config.twitter.consumerSecret,
    callbackURL: `${config.url}/auth/twitter/callback`
  },
  (token, tokenSecret, profile, done) => {
    passport.session.id = profile.id;
    profile.twitter_token = token;
    profile.twitter_token_secret = tokenSecret;
    process.nextTick(() => {
      return done(null, profile);
    });
  }
));

export default passport;
