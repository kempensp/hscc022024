var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();
var bodyParser = require('body-parser');


// Router list--Be sure to add a router line for each route we use!
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var page2Router = require('./routes/page2');
var statsRouter = require('./routes/stats');
var loginRouter = require('./routes/login');
var getusersRouter = require('./routes/getusers'); //ADDED 3/16/24
var logoutRouter = require('./routes/logout'); //ADDED 4/6/24
var editprofileRouter = require('./routes/editprofile'); //ADDED 4/13/24
var getopportunitiesRouter = require('./routes/getopportunities'); //ADDED 4/20/24 OTHER
var addopportunitiesRouter = require('./routes/addopportunities'); //ADDED 4/27/24 

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// As we add routes, we need to add an app.use line here!
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/page2', page2Router);
app.use('/index', indexRouter);
app.use('/stats', statsRouter);
app.use('/login', loginRouter); //ADDED 3/9/24
app.use('/getusers',getusersRouter); //Added 3/16
app.use('/logout',logoutRouter); //Added 4/6
app.use('/editprofile',editprofileRouter); //Added 4/13
app.use('/getopportunities',getopportunitiesRouter); //Added 4/20 OTHER
app.use('/addopportunities',addopportunitiesRouter); //Added 4/27 

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {title: '404 error',
  id: res.locals.user_id,
  role: res.locals.role,
  name: res.locals.name
});
});

module.exports = app;
