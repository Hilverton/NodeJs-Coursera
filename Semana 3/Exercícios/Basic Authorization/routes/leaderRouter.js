const express = require('express');
const bodyParser = require('body-parser');
const Leaders = require('../models/leaders');

const Header = require('../utils/setHeader');

const leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
  .get((req, res, next) => {
    Leaders.find({})
      .then(leaders => {
        Header(res, leaders);
      }, err => next(err))
      .catch(err => next(err));
  })
  .post((req, res, next) => {
    Leaders.create(req.body)
      .then(leader => {
        Header(res, leader);
      }, err => next(err))
      .catch(err => next(err));
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /leaders');
  })
  .delete((req, res, next) => {
    Leaders.deleteMany()
      .then(resp => {
        Header(res, resp);
      }, (err) => next(err))
      .catch((err) => next(err));
  });


leaderRouter.route('/:leaderId')
  .get((req, res, next) => {
    Leaders.findById(req.params.leaderId)
      .then(leader => {
        Header(res, leader);
      }, err => next(err))
      .catch(err => next(err));
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /leaders/' + req.params.leaderId);
  })
  .put((req, res, next) => {
    Leaders.findByIdAndUpdate(req.params.leaderId, {
      $set: req.body
    }, { new: true })
      .then(leader => {
        Header(res, leader);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .delete((req, res, next) => {
    Leaders.findByIdAndRemove(req.params.leaderId)
    .then(resp => {
      Header(res, resp);
    }, (err) => next(err))
      .catch((err) => next(err));
  });

module.exports = leaderRouter;