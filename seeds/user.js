'use strict';

const faker = require('faker');
const bcrypt = require('bcryptjs');

const { table } = require('../orm');

const seed = Promise.all(
  [1, 2, 3].map(function(n) {
    return table('users').insert({
      id: faker.random.uuid(),
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: bcrypt.hashSync(faker.internet.password())
    });
  })
);

seed.then(d => {
  console.log('seeded Users', d);
});
