const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

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

const dishRouter = require('./routes/dishRouter');
const promoRouter = require('./routes/promoRouter');
const leaderRouter = require('./routes/leaderRouter');
const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());

app.use(cookieParser('12345-67890-09876-54321'));

function auth(req, res, next) {
  console.log(req.headers);
  if (!req.signedCookies.user) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      let err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      next(err);
      return;
    }
    const [username, password] = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    if (username === 'admin' && password === 'password') {
      next(); //authorized
    } else {
      let err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      next(err);
      return;
    }
  } else {
    if (req.signedCookies.user === 'admin') {
      next();
    } else {
      let err = new Error('You are not authenticated!');
      err.status = 401;
      next(err);
      return;
    }
  }
}

app.use(auth);

app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);

app.listen(PORT, () => {
  console.log('server started');
});