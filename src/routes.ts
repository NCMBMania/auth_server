const fs = require('fs');
const path = require('path');
const NCMB = require('ncmb');
const config = require('../config');
const { promisify } = require('util');
const ejs = require('ejs');

const ncmb = new NCMB(config.ncmb.applicationKey, config.ncmb.clientKey);

export default (app, server, passport) => {
  app.get('/auth/twitter', passport.authenticate('twitter'));
  app.get('/auth/facebook', passport.authenticate('facebook'));
  app.get('/auth/google', passport.authenticate('google',{
    scope: config.google.scope
  }));
  app.get('/success', async (request, response) => {
    const params = {...request.user};
    const provider = params.provider;
    switch (provider) {
      case 'twitter':
        params.oauth_consumer_key = config.twitter.consumerKey;
        params.consumer_secret = config.twitter.consumerSecret;
        params.screen_name = params.username;
        break;
      case 'facebook':
        break;
    }
    try {
      await ncmb.User.loginWith(provider, params);
    } catch (e) {
      console.log(e);
    }
    const data = {user: ncmb.User.getCurrentUser(), sessionToken: ncmb.sessionToken};
    response.render(path.join(__dirname, '..', 'views', '/success.ejs'), data);
  });
  app.get('/auth/twitter/callback', 
      passport.authenticate('twitter', {
        successRedirect: '/success',
        failureRedirect: '/login'
      })
  );
  app.get('/auth/facebook/callback', 
      passport.authenticate('facebook', {
        successRedirect: '/success',
        failureRedirect: '/login'
      })
  );
  app.get('/auth/google/callback', 
      passport.authenticate('google', {
        successRedirect: '/success',
        failureRedirect: '/login'
      })
  );
};
