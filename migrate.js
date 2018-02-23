'use strict';

const migrate = require('tabel/lib/migrate');
const ormConfig = require('config'); // the same config as shown in "Setting up"
migrate(ormConfig);
