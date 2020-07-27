const express = require('express');
const bodyParser = require('body-parser');

const indexRouter = express.Router();

indexRouter.get('',(req, res) => {
  return res.json({"index": "Home Page!"});
});

module.exports = indexRouter;

