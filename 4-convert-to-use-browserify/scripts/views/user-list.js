var Users = require('../collections/users');

module.exports = Backbone.View.extend({
  el: '.page',
  render: function() {
    var that = this;
    var users = new Users();
    users.fetch({
      success: function() {
        var template = createTemplate('user-list', {users: users.models});
        that.$el.html(template);
      }
    });
  }
});
