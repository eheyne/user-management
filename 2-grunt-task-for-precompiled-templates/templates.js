this["JST"] = this["JST"] || {};

this["JST"]["templates/user-list.hbs"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <tr>\n      <td>"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.attributes)),stack1 == null || stack1 === false ? stack1 : stack1.firstname)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</td>\n      <td>"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.attributes)),stack1 == null || stack1 === false ? stack1 : stack1.lastname)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</td>\n      <td>"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.attributes)),stack1 == null || stack1 === false ? stack1 : stack1.age)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</td>\n      <td><a href=\"#/edit/"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.attributes)),stack1 == null || stack1 === false ? stack1 : stack1.id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" class=\"btn\">Edit</a></td>\n    </tr>\n    ";
  return buffer;
  }

  buffer += "  <a href=\"#/new\" class=\"btn btn-primary\">New User</a>\n  <hr />\n  <table class=\"table table-striped\">\n  <thead>\n    <tr>\n      <th>First Name</th>\n      <th>Last Name</th>\n      <th>Age</th>\n      <th></th>\n    </tr>\n  </thead>\n  <tbody>\n    ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.users), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </tbody>\n</table>\n";
  return buffer;
  });