this["JST"] = this["JST"] || {};

this["JST"]["./templates/edit-user.tpl"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<form class="edit-user-form">\n  <legend>' +
((__t = ( user ? 'Update' : 'Create' )) == null ? '' : __t) +
' User</legend>\n  <label>First Name</label>\n  <input type="text" name="firstname" value="' +
((__t = ( user ? user.get('firstname') : '' )) == null ? '' : __t) +
'"/>\n  <label>Last Name</label>\n  <input type="text" name="lastname" value="' +
((__t = ( user ? user.get('lastname') : '' )) == null ? '' : __t) +
'"/>\n  <label>Age</label>\n  <input type="text" name="age" value="' +
((__t = ( user ? user.get('age') : '' )) == null ? '' : __t) +
'"/>\n  <hr />\n  <button type="submit" class="btn">' +
((__t = ( user ? 'Update' : 'Create' )) == null ? '' : __t) +
'</button>\n  ';
 if(user) { ;
__p += '\n    <input type="hidden" name="id"  value="' +
((__t = ( user.id )) == null ? '' : __t) +
'" />\n    <button class="btn btn-danger delete">Delete</button>\n  ';
 }; ;
__p += '\n</form>\n';

}
return __p
};

this["JST"]["./templates/user-list.tpl"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<a href="#/new" class="btn btn-primary">New User</a>\n<hr />\n<table class="table table-striped">\n<thead>\n  <tr>\n    <th>First Name</th>\n    <th>Last Name</th>\n    <th>Age</th>\n    <th></th>\n  </tr>\n</thead>\n<tbody>\n  ';
 _.each(users, function(user) { ;
__p += '\n    <tr>\n      <td>' +
((__t = ( user.get('firstname') )) == null ? '' : __t) +
'</td>\n      <td>' +
((__t = ( user.get('lastname') )) == null ? '' : __t) +
'</td>\n      <td>' +
((__t = ( user.get('age') )) == null ? '' : __t) +
'</td>\n      <td><a href="#/edit/' +
((__t = ( user.id )) == null ? '' : __t) +
'" class="btn">Edit</a></td>\n    </tr>\n  ';
 }); ;
__p += '\n</tbody>\n\n';

}
return __p
};