'use strict';
exports.__esModule = true;
var http = require('http');
var express = require('express');
var session = require('express-session');
var config = require('../config');
var cookieParser = require('cookie-parser');
var passport_1 = require("./passport");
var routes_1 = require("./routes");
var app = express();
var server = http.createServer(app);
app.use(cookieParser());
app.set("view engine", "ejs");
if (config.secret === 'SOMETHING_LONG_STRING') {
    throw new Error('セッション用シークレット文字列を変更してください');
}
app.use(session({ secret: config.secret }));
app.use(passport_1["default"].initialize());
app.use(passport_1["default"].session());
app.use(express.static(__dirname + '/../public'));
routes_1["default"](app, server, passport_1["default"]);
server.listen(3000);
console.log('Listening on port %d in %s mode', server.address().port, app.settings.env);
