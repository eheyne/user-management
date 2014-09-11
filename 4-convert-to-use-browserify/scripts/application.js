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
