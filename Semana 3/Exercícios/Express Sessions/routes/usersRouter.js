const express = require('express');
const bodyParser = require('body-parser');

const User = require('../models/user');

const userRouter = express.Router();
userRouter.use(bodyParser.json());

userRouter.post('/signup', (req, res, next) => {
  const { username, password } = req.body;
  User.findOne({ username })
    .then(user => {
      if (user !== null) {
        let err = new Error(`User ${username} already exists!`);
        err.status = 403;
        next(err);
      } else {
        return User.create({
          username,
          password
        });
      }
    })
    .then(user => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({ status: 'Registration Successfull', user });
    }, err => next(err))
    .catch(err => next(err));
});

userRouter.post('/login', (req, res, next) => {
  if (!req.session.user) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      let err = new Error('You are not authenticated! UserRouter');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      next(err);
      return;
    }
    const [username, password] = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');

    User.findOne({ username })
      .then(user => {
        if (user === null) {
          let err = new Error(`User ${username} does not exist!`);
          err.status = 403;
          return next(err);
        } else if (user.password !== password) {
          let err = new Error('Your password is incorrect!');
          err.status = 403;
          return next(err);
        } else if (user.username === username && user.password === password) {
          req.session.user = 'authenticated';
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/plain');
          res.end('You are authenticated!')
        }
      })
      .catch(err => next(err));
  } else {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('You are authenticated!')
  }
});

userRouter.get('/logout', (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  } else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

module.exports = userRouter;