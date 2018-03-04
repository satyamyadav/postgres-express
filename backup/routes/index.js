'use strict';

const express = require("express");
const router = express.Router();
const posts = require('./posts');

module.exports = function (app, db) {

  router.use('/api/posts', posts(app, db));
  
  router.route('*').all(function(req, res, next) {
    res.json({
      msg: 'I am alive !!'
    });
  });

  return router;
};

