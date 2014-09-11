(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var UserList = require('./views/user-list');
var EditUser = require('./views/edit-user');
var Router = require('./routers/application');

function Application() {
  var userList = new UserList();
  var editUser = new EditUser();
  this.router = new Router();

  this.router.on('route:home', function() {
    userList.render();
  });
  this.router.on('route:editUser', function(id) {
    editUser.render({id: id});
  });
  Backbone.history.start();
}

window.App = new Application();

},{"./routers/application":4,"./views/edit-user":5,"./views/user-list":6}],2:[function(require,module,exports){
module.exports = Backbone.Collection.extend({
    url:  '/users'
});

},{}],3:[function(require,module,exports){
module.exports = Backbone.Model.extend({
  urlRoot: '/users'
});

},{}],4:[function(require,module,exports){
module.exports = Backbone.Router.extend({
  routes: {
    '': 'home',
    'new': 'editUser',
    'edit/:ed': 'editUser'
  }
});
},{}],5:[function(require,module,exports){
var User = require('../models/user');

module.exports = Backbone.View.extend({
  el: '.page',
  render: function(options) {
    debugger;
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
        App.router.navigate('', {trigger: true});
      }
    });
    console.log(userDetails);
    return false;
  },

  deleteUser: function(ev) {
    this.user.destroy({
      success: function() {
        App.router.navigate('', {trigger: true});
      }
    });
    return false;
  }
});

},{"../models/user":3}],6:[function(require,module,exports){
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

},{"../collections/users":2}]},{},[1]);
