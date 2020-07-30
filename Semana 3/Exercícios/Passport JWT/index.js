const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const config = require('./config');

const PORT = 3000;
const url = config.mongoUrl;
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

app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/users', userRouter);

app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);

app.listen(PORT, () => {
  console.log('server started');
});