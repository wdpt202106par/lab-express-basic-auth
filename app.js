require('dotenv').config();

const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();
const session = require('express-session');

const mongoStore= require('connect-mongo')(session)

// require database configuration
require('./configs/db.config');
app.use(
    session({
      secret: 'super session secret',
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 3600000 }, // 60 * 1000 ms === 1 min
      store:new mongoStore({mongooseConnection:mongoose.connection,
    ttl:60*60*24})
    })
  );

// Middleware Setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

const index = require('./routes/index.routes');
app.use('/', index);


const sign=require('./routes/signup');
app.use('/', sign)

module.exports = app;
