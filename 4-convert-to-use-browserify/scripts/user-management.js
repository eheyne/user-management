(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var UserList = require('./views/user-list');
var EditUser = require('./views/edit-user');
var Router = require('./routers/application');

function createTemplate(templateName, data) {
  var templatePath = 'templates/' + templateName + '.hbs';
  var templateString = window['JST'][templatePath](data);
  return templateString;
}

$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
  options.url = 'http://backbonejs-beginner.herokuapp.com' + options.url;
});

$.fn.serializeObject = function() {
  var o = {};
  var a = this.serializeArray();
  $.each(a, function() {
    if (o[this.name] !== undefined) {
      if (!o[this.name].push) {
        o[this.name] = [o[this.name]];
      }
      o[this.name].push(this.value || '');
    } else {
      o[this.name] = this.value || '';
    }
  });
  return o;
};

var userList = new UserList();
var editUser = new EditUser();
var router = new Router();

router.on('route:home', function() {
  userList.render();
});
router.on('route:editUser', function(id) {
  editUser.render({id: id});
});
Backbone.history.start();


},{"./routers/application":3,"./views/edit-user":4,"./views/user-list":5}],2:[function(require,module,exports){
module.exports = Backbone.Collection.extend({
    url:  '/users'
});

},{}],3:[function(require,module,exports){
module.exports = Backbone.Router.extend({
  routes: {
    '': 'home',
    'new': 'editUser',
    'edit/:ed': 'editUser'
  }
});
},{}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
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
