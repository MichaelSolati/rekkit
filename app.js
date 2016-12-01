var express = require('express');
var session = require("express-session");
var path = require('path');
var logger = require('morgan');
var cors = require('cors')
var bodyParser = require('body-parser');

var api = require('./api/index');

var app = express();

global.appRoot = path.resolve(__dirname);

app.set('views', path.join(__dirname, 'views'));
app.listen(process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({credentials: true, origin: true}));

app.use('/api',api);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});

module.exports = app;
