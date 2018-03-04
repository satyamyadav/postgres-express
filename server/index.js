'use strict';

const config = require('config');
const { table } = require('../orm');
const PORT = config.port || 4000;
const express = require('express');
const routes = require('./routes');

var app = express();

app.use('/', routes(app, table));

const server = app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

module.exports = server;