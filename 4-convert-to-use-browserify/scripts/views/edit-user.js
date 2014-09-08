module.exports = Backbone.View.extend({
  el: '.page',
  render: function(options) {
    var that = this;
    if (options.id) {
      this.user = new User({id: options.id});
      this.user.fetch({
        success: function(user) {
          var template = createTemplate('edit-user', {user: user});
          that.$el.html(template);
        }
      });
    } else {
      var template = createTemplate('edit-user', {user: null});
      this.$el.html(template);
    }
  },
  events: {
    'submit .edit-user-form': 'saveUser',
    'click .delete': 'deleteUser'
  },
  saveUser: function(ev) {
    var userDetails = $(ev.currentTarget).serializeObject();
    var user = new User();
    user.save(userDetails, {
      success: function(user) {
        router.navigate('', {trigger: true});
      }
    });
    console.log(userDetails);
    return false;
  },

  deleteUser: function(ev) {
    this.user.destroy({
      success: function() {
        router.navigate('', {trigger: true});
      }
    });
    return false;
  }
});