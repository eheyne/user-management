var UserList = require('./views/user-list');
var EditUser = require('./views/edit-user');
var Router = require('./routers/application');

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

