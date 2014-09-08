module.exports = Backbone.Router.extend({
  routes: {
    '': 'home',
    'new': 'editUser',
    'edit/:ed': 'editUser'
  }
});