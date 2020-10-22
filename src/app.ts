'use strict';
const http = require('http');
const express = require('express');
const session = require('express-session');
const config = require('../config');
const cookieParser = require('cookie-parser');
import passport from './passport';
import configRoutes from './routes';
const app = express();
const server = http.createServer(app);

app.use(cookieParser());
app.set("view engine", "ejs");
if (config.secret === 'SOMETHING_LONG_STRING') {
  throw new Error('セッション用シークレット文字列を変更してください');
}
app.use(session({secret: config.secret}));
app.use(passport.initialize()); 
app.use(passport.session());
app.use(express.static(__dirname + '/../public'));
configRoutes(app, server, passport);
server.listen(3000);
console.log('Listening on port %d in %s mode', server.address().port, app.settings.env);
