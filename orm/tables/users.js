'use strict';

module.exports = function(orm) {
  orm.defineTable({
    name: 'users',
    props: {
      key: 'id',
      autoId: false,
      perPage: 25,
      timestamps: true
    },
    scopes: {},
    joints: {
      joinComments() {
        return this.joinPosts().join(
          'comments',
          'comments.post_id',
          '=',
          'posts.id'
        );
      },
      joinPosts() {
        return this.join('posts', 'users.id', '=', 'posts.author_id');
      }
    },
    relations: {
      posts: function() {
        return this.hasMany('posts', 'author_id');
      }
    }
  });
};
