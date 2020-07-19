const express = require('express');
const bodyParser = require('body-parser');
const Promotions = require('../models/promotions');

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
  .post((req, res, next) => {
    Promotions.create(req.body)
      .then(promo => {
        console.log('Promo Created ', promo);
        Header(res, promo);
      }, err => next(err))
      .catch(err => next(err));
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
  })
  .delete((req, res, next) => {
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
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /promotions/' + req.params.promoId);
  })
  .put((req, res, next) => {
    Promotions.findByIdAndUpdate(req.params.promoId, {
      $set: req.body
    }, { new: true })
      .then(promo => {
        Header(res, promo);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .delete((req, res, next) => {
    Promotions.findByIdAndRemove(req.params.promoId)
    .then(resp => {
      Header(res, resp);
    }, (err) => next(err))
      .catch((err) => next(err));
  });

module.exports = promoRouter;