'use strict';

const config =  require('config');
const { table } = require('../orm');
const PORT = config.port || 4000;
const express =  require('express');
const routes = require('./routes');

var app = express();

app.use('/', routes(app, table));

app.listen(PORT, function(e) {
  console.log('server running on Port: ', e, PORT);
});

module.exports = app;