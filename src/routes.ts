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
  app.get('/auth/apple', passport.authenticate('apple'));
  app.get('/auth/google', passport.authenticate('google',{
    scope: config.google.scope
  }));
  app.get('/success', async (request, response) => {
    const params = request.user;
    const data = {user: '', sessionToken: '', error: ''};
    try {
      await ncmb.User.loginWith(params.provider, params);
      data.user = ncmb.User.getCurrentUser();
      data.sessionToken = ncmb.sessionToken;
      response.render(path.join(__dirname, '..', 'views', '/success.ejs'), data);
    } catch (e) {
      data.error = e.error;
      response.render(path.join(__dirname, '..', 'views', '/success.ejs'), data);
    }
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
  app.post('/auth/apple/callback', 
    passport.authenticate('apple', {
      successRedirect: '/success',
      failureRedirect: '/login'
    })
  );  
};
