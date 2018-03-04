'use strict';

const express = require('express');
const router = express.Router();

module.exports = (app, db) => {

  router.route('/').get(async (req, res) => {  
    const posts = await db('posts').all()
    
    res.json({
      data: posts,
      status: 'success'
    });
    
  });

  return router;
};