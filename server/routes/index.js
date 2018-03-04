'use strict';

const express = require("express");
const router = express.Router();
const posts = require('./posts');

module.exports = (app, db) => {

  router.use('/api/posts', posts(app, db));
  
  router.route('*').all((req, res) => {
    res.json({
      message: 'hello, world!',
      status: 'success'
    });
  });

  return router;
};

