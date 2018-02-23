'use strict';

const { table } = require('../orm');

const posts = table('posts').all();

posts.then(d => console.log(d));
