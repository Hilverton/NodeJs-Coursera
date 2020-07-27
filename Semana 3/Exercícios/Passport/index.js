const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const passport = require('passport');
const authenticate = require('./authenticate');

const PORT = 3000;
const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
/** 
 * useCreateIndex: true => collection.ensureIndex padrão descontinuado
 * useNewUrlParser: true => novo parser de string
 * useUnifiedTopology: true => o padrão anterior é false, mas foi descontinuado
 * useFindAndModify: false => o padrão é true, mas foi descontinuado
*/
connect.then((db) => {
  console.log("Connected correctly to server");
}, (err) => { console.log(err); });

const indexRouter = require('./routes/indexRouter');
const userRouter = require('./routes/usersRouter');
const dishRouter = require('./routes/dishRouter');
const promoRouter = require('./routes/promoRouter');
const leaderRouter = require('./routes/leaderRouter');

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());

//app.use(cookieParser('12345-67890-09876-54321'));

app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', userRouter);

function auth(req, res, next) {
  console.log(req.user);

  if (!req.user) {
    var err = new Error('You are not authenticated!');
    err.status = 403;
    next(err);
  }
  else {
    next();
  }
}

app.use(auth);

app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);

app.listen(PORT, () => {
  console.log('server started');
});