const express = require('express');
const bodyParser = require('body-parser');
const Promotions = require('../models/promotions');
const authenticate = require('../authenticate');
const Header = require('../utils/setHeader');

const promoRouter = express.Router();
promoRouter.use(bodyParser.json());

promoRouter.route('/')
  .get((req, res, next) => {
    Promotions.find({})
      .then(promos => {
        Header(res, promos);
      }, err => next(err))
      .catch(err => next(err));
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    Promotions.create(req.body)
      .then(promo => {
        console.log('Promo Created ', promo);
        Header(res, promo);
      }, err => next(err))
      .catch(err => next(err));
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Promotions.deleteMany()
      .then(resp => {
        Header(res, resp);
      }, (err) => next(err))
      .catch((err) => next(err));
  });


promoRouter.route('/:promoId')
  .get((req, res, next) => {
    Promotions.findById(req.params.promoId)
      .then(promo => {
        Header(res, promo);
      }, err => next(err))
      .catch(err => next(err));
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /promotions/' + req.params.promoId);
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    Promotions.findByIdAndUpdate(req.params.promoId, {
      $set: req.body
    }, { new: true })
      .then(promo => {
        Header(res, promo);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Promotions.findByIdAndRemove(req.params.promoId)
    .then(resp => {
      Header(res, resp);
    }, (err) => next(err))
      .catch((err) => next(err));
  });

module.exports = promoRouter;