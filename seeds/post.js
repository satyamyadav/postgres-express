'use strict';

const faker = require('faker');
const { table } = require('../orm');

var seed = Promise.all(
  [1, 2, 3].map(function(n) {
    return table('posts').insert([
      {
        id: faker.random.uuid(),
        author_id: faker.random.uuid(),
        title: faker.lorem.sentence(),
        body: faker.lorem.sentence(),
        slug: faker.lorem.sentence().replace(/ /g, '-')
      }
    ]);
  })
);

seed.then(d => {
  console.log('seeded Posts', d);
});
