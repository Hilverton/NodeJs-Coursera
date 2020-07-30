const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const User = require('../models/user');
const authenticate = require('../authenticate');

const userRouter = express.Router();
userRouter.use(bodyParser.json());

userRouter.get('/', async (req, res, next) => {
  const result = await User.find();
  return res.json({ user: result });
})


userRouter.post('/signup', (req, res, next) => {
  const { username, password } = req.body;
  User.register(new User({ username }), password, (err, user) => {
    if (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({ err });
    } else {
      passport.authenticate('local')(req, res, () => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, status: 'Registration Successful!'});
      });
    }
  })
});

userRouter.post('/login', passport.authenticate('local'), (req, res, next) => {
  const { _id } = req.user;
  const token = authenticate.getToken({ _id })
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token, status: 'You are successfully logged in!'});
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