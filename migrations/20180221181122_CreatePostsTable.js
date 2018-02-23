'use strict';

function up(knex) {
  return knex.schema.createTable('posts', t => {
    t.uuid('id').primary();
    t.uuid('author_id');
    t.text('title');
    t.text('body');
    t.text('slug').unique();
    t.timestamps();
  });
}

function down(knex) {
  return knex.schema.dropTable('posts');
}

module.exports = { up, down };
