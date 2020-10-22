const fs = require('fs');
const path = require('path');
const NCMB = require('ncmb');
const config = require('../config');
const { promisify } = require('util');
const ejs = require('ejs');

const ncmb = new NCMB(config.ncmb.applicationKey, config.ncmb.clientKey);

export default (app, server, passport) => {
  app.get('/auth/twitter', passport.authenticate('twitter'));
  app.get('/success', async (request, response) => {
    const params = {...request.user};
    params.oauth_consumer_key = config.twitter.consumerKey;
    params.consumer_secret = config.twitter.consumerSecret;
    await ncmb.User.loginWith('twitter', params);
    const data = {user: ncmb.User.getCurrentUser(), sessionToken: ncmb.sessionToken};
    response.render(path.join(__dirname, '..', 'views', '/success.ejs'), data);
  });
  app.get('/auth/twitter/callback', 
      passport.authenticate('twitter', {
        successRedirect: '/success',
        failureRedirect: '/login'
      })
  );
};
