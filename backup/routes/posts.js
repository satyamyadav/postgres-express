'use strict';

const express = require('express');
const router = express.Router();

module.exports = function(app, db) {
  router.route('/').get(function(req, res) {
    
    db('posts').all().then(function (d) {
      res.json({
        data: d,
        status: 'success'
      });
    });
    
  });
  return router;
};
