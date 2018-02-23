'use strict';

module.exports = function(orm) {
  orm.defineTable({
    name: 'posts',
    props: {
      key: 'id',
      autoId: false,
      perPage: 25,
      timestamps: true
    },
    scopes: {},
    joints: {},
    relations: {
      user: function() {
        return this.belongsTo('users', 'user_id');
      }
    },
    methods: {}
  });
};
