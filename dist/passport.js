"use strict";
exports.__esModule = true;
var config = require('../config');
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
passport.serializeUser(function (user, done) {
    var params = {
        id: user.id,
        screen_name: user.username,
        oauth_token: user.twitter_token,
        oauth_token_secret: user.twitter_token_secret
    };
    done(null, JSON.stringify(params));
});
passport.deserializeUser(function (obj, done) {
    done(null, JSON.parse(obj));
});
passport.use(new TwitterStrategy({
    consumerKey: config.twitter.consumerKey,
    consumerSecret: config.twitter.consumerSecret,
    callbackURL: config.url + "/auth/twitter/callback"
}, function (token, tokenSecret, profile, done) {
    passport.session.id = profile.id;
    profile.twitter_token = token;
    profile.twitter_token_secret = tokenSecret;
    process.nextTick(function () {
        return done(null, profile);
    });
}));
exports["default"] = passport;
