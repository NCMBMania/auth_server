"use strict";
exports.__esModule = true;
var config = require('../config');
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (obj, done) {
    done(null, obj);
});
passport.use(new TwitterStrategy({
    consumerKey: config.twitter.consumerKey,
    consumerSecret: config.twitter.consumerSecret,
    callbackURL: config.url + "/auth/twitter/callback"
}, function (token, tokenSecret, profile, done) {
    passport.session.id = profile.id;
    profile.oauth_token = token;
    profile.oauth_token_secret = tokenSecret;
    process.nextTick(function () {
        return done(null, profile);
    });
}));
passport.use(new FacebookStrategy({
    clientID: config.facebook.appId,
    clientSecret: config.facebook.appSecret,
    callbackURL: config.url + "/auth/facebook/callback",
    profileFields: ['id']
}, function (accessToken, refreshToken, params, profile, done) {
    passport.session.id = profile.id;
    profile.access_token = accessToken;
    profile.expiration_date = {
        '__type': 'Date',
        'iso': (new Date((new Date()).getTime() + params.expires_in * 1000)).toISOString()
    };
    process.nextTick(function () {
        return done(null, profile);
    });
}));
exports["default"] = passport;
