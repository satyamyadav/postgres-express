'use strict';

module.exports = {
  port: 4000,
  db: {
    client: 'postgresql',
    connection: {
      database: 'api_dev',
      host: 'localhost',
      port: 5432,
      user: 'dev',
      password: 'dev'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: 'knex_migrations'
  },
  // redis config is optional, is used for caching by tabel
  redis: {
    host: 'localhost',
    port: '6379',
    keyPrefix: 'dev.api.'
  }
};
