var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api');
var postsRouter = require('./routes/posts');
var thirdPartyRouter = require('./routes/third_party');
var adminRouter = require('./routes/admin');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(bodyParser.json()); //数据JSON类型
// app.use(bodyParser.urlencoded({ extended: false })); //解析post请求数据

app.use(session({
    secret: 'jrForumSc',
    resave: false,
    saveUninitialized: false,
    name: 'jFSession',
    cookie: {
        httpOnly: false,
        maxAge: null
    }
}))

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);
app.use('/posts', postsRouter);
app.use('/third_party', thirdPartyRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    // next(createError(404));
    res.status(404).render("back/404", { path: req.url, title: 'jrForum' });
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.all('*', function(req, res, next) {
    let origin = req.headers.origin;
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-type', 'text/plain; charset=utf-8');
    next();
})

module.exports = app;