var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var db = require('./config/connect')
var session =require('express-session')
const hbs =require('express-handlebars')
const fileupload =require('express-fileupload')

var indexRouter = require('./routes/index');
var signupRouter = require('./routes/signup');
const adminRouter =require('./routes/admin')
var userRouter = require('./routes/user');
const nocache = require('nocache');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs',hbs.engine({extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname+'/views/layout/',partialsDir:__dirname+'/views/partials/'}))
app.use(logger('dev'));
app.use(nocache(

  
))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileupload())
app.use(session({
  secret:"secret key",
  saveUninitialized:true,
  cookie:{maxAge:900000},
  resave:false
}))

db.connect()


app.use('/', indexRouter);
app.use('/signup', signupRouter);
app.use('/admin',adminRouter)
app.use('/user' , userRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
