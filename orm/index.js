'use strict';

const Tabel = require('tabel');
const config = require('config');
const orm = new Tabel(config);

require('./tables')(orm);

module.exports = orm.exports;
