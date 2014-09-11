# User Management

## Table of Contents
  - [Overview](#user-content-overview)
  - [Step 1: Precompiling Underscore Templates](#user-content-step-1-precompiling-underscore-templates)
  - [Step 2: Grunt task for Precompiled Templates](#user-content-step-2-grunt-task-for-precompiled-templates)
  - [Step 3: Convert from Underscore templates to Handlebars](#user-content-step-3-convert-from-underscore-templates-to-handlebars)
  - [Step 4: Convert to CommonJS Modules with browserify](#user-content-step-4-convert-to-commonjs-modules-with-browserify)
  - [References](#user-content-references)

## Overview
This tutorial was put in place to grow a base backbone application to a ready to deploy Single Page Application (SPA).  It starts with a basic backbone.js application with CRUD functionality that uses templates.  It builds on the application built by [Thomas Davis](http://thomasdav.is) in this [video](https://www.youtube.com/watch?v=FZSjvWtUxYk) and incrementally adds features. There is an `index.html` file in a folder called `workspace`. It is the finished product from this video.  If this is all new to you, I encourage you to follow along with the video and build the application yourself.  If you already have some basic backbone.js understanding and want to move forward with this tutorial then you can use the base application provided here to build your application along with the tutorial.

The process of building up a deployable application includes making the source code maintainable, testing the code, making the end product performant, and minification of the finished product.  A number of JavaScript libraries exist to help achieve these goals. One library, [Grunt](http://gruntjs.com), exists to aid a developer in building such a product by providing a means for defining and executing tasks.  As you go through each step in the tutorial you will learn about new libraries and what services they provide.  You will also learn how to setup Grunt tasks to make the use of these libraries transparent to other developers.  This tutorial is designed so that you can go through each step start to finish or jump to a single step if you are looking for something specific.  Each step in this tutorial is built on the previous step.  The source code is broken down into sub-directories of the form `1-Name of Step`, `2-Name of next step`, etc.  This allows you to see the incremental steps taken to get to the finished product.  It also allows you to compare the source code with the previous steps.

I hope you find this tutorial helps you with your JavaScript product development workflow.

## Step 1: Precompiling Underscore Templates

### Review of Backbone and Underscore

As mentioned in the [Overview](#user-content-overview) the base application uses backbone and one of the dependencies of Backbone is [Underscore](http://underscorejs.org). Underscore is a JavaScript library that provides many helpful functions, one of which is a function called `template` that will precompile an HTML template into a JavaScript function, which can be used for plugging in dynamic content to the markup. This application defines templates inside of a `<script>` tag.  

```html
  <script type="text/template" id="edit-user-template">
    <form class="edit-user-form">
      <legend><%= user ? 'Update' : 'Create' %> User</legend>
      <label>First Name</label>
      <input type="text" name="firstname" value="<%= user ? user.get('firstname') : '' %>"/>
      <label>Last Name</label>
      <input type="text" name="lastname" value="<%= user ? user.get('lastname') : '' %>"/>
      <label>Age</label>
      <input type="text" name="age" value="<%= user ? user.get('age') : '' %>"/>
      <hr />
      <button type="submit" class="btn"><%= user ? 'Update' : 'Create' %></button>
      <% if(user) { %>
        <input type="hidden" name="id"  value="<%= user.id %>" />
        <button class="btn btn-danger delete">Delete</button>
      <% }; %>
    </form>
  </script>
```

Notice the script block contains HTML as well as other syntax.  The other syntax is JavaScript surrounded by `<%=` and `%>`.  If you want more information about this syntax look at the [template function for underscore](http://underscorejs.org/#template).

The code used to show this template is:

```javascript
  var template = _.template($('#user-list-template').html(), {users: users.models} );
  this.$el.html(template);
```

This code calls the underscore template function with two arguments, the first being the HTML found in the specified script tag.  The second argument is some object that the template will interpolate.

### Pre-compilation

A common practice today in building SPAs is to remove the processing of templates from being real time to pre-compiling them before they are needed.  This step in the tutorial we will take that compilation and move it into an application load event so that when the template is requested it is already compiled and ready for use.  You can follow along with this tutorial and modify the `index.html` file in the `workspace` folder off of the root folder or you can look at the finished product for this step in the `1-inline-precompiled-templates` folder.

In order to do this we will need a couple new functions.  If you are following along, the below code can be dropped into the script tag where the `$.ajaxPrefilter` function can be found.

```javascript
  function init() {
    window.JST = {
      'user-list' : _.template($('#user-list-template').html()),
      'edit-user' : _.template($('#edit-user-template').html())
    };
  }
  
  function createTemplate(name, model) {
    var templateFunc = window.JST[name];
    return templateFunc(model);
  }

  window.onload = init;
```

The first function `init` will create an object called `JST` and put it on the global, `window` object.  Notice that the object is built by using a key (`'user-list'`) with the same name as the template and the value will be the pre-compiled template source.

The second function `createTemplate` takes the name of the template along with the model.  This function looks into the object, `JST`,  that was created in the `init` function and pulls out the appropriate template function source code that was stored there.  It will then execute the function passing in the model and return the resulting HTML.  A call to this function will replace the call to Underscore's template function inside of our backbone view.  The new view code will look like this:

```javascript
  var template = createTemplate('user-list', {users: users.models});
  this.$el.html(template);
```

This code is very similar to the actual call to Underscore's template function differing only in the first argument where we only need to pass the name of the template that we want to load.  Also notice after the two functions definitions we call `window.onload = init;` so that on the window load event we call our new init function. This is a way to pre-compile the templates before they are needed in the views. This however does still compile them in the browser before the application starts.  In the next step we will talk about how we can pre-compile before running the application in a browser.

If you have not already done so, replace all occurrences of the call to Underscore's template (`_.template`) with our new `createTemplate` function.

__Note:__ Be mindful of the use of `this` or `that` in the setting of the html on the DOM object in the corresponding line of code.

### Setup Application for Testing Template Pre-compilation

To test our application we will use a Node.js module called [http-server](https://www.npmjs.org/package/http-server) to bring up a local webserver and host our page.  To install this locally use this command:

```shell
  npm install -g http-server
```

or if you are on a Mac and get an `EACCES` error.

```shell
  sudo npm install -g http-server
```

Now in the `workspace` folder where you changed the code, run the command:

```shell
http-server
```

Now bring up a browser and navigate to `localhost:8080`.  You should see the application appear in the browser window.  Going forward this mechanism can be used in each of the project step folders to bring up the application.


The source code for this step is located in the folder `1-inline-precompiled-templates`. As stated in the [Overview](#user-content-overview) this tutorial takes small incremental steps to help you better understand what is going on behind the scenes. The next step in the tutorial will show how with `Grunt` we can do this before the application is loaded.

## Step 2: Grunt Task for Precompiled Templates
This step builds upon what was covered in the [Precompiling Underscore Templates](#user-content-step-1-precompiling-underscore-templates) step, so you can copy the contents of the `1-inline-precompiled-templates` folder to some workspace where you can make the below changes.  The completed code for this step can be found in the `2-grunt-taks-for-precompiled-templates` folder.

### Node/Grunt Background and Setup

To pre-compile templates outside of the application we will use [Grunt](http://gruntjs.com/). Grunt requires [Node](nodejs.org) to be installed.

If you do not already have it, please install [Node](nodejs.org) now.

After Node is installed, you can install the [Grunt client](https://github.com/gruntjs/grunt-cli) globally with the following command:

```shell
npm install -g grunt-cli
```

If you have not used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started guide](http://gruntjs.com/getting-started), as it explains how to create a Gruntfile as well as install and use Grunt plugins. Pay special attention on the section where it talks about the `package.json` file as we will need to create one for this part of the project. For this exercise we can just create the `package.json` file in the root of your workspace and put an empty JavaScript object in it `{  }` for now.  Using the `--save` and `--save-dev` options when executing an `npm` command will add content to this file.  This is demonstrated below.

Grunt allows the use of plugins. A Grunt plugin is a Node package that can be published via NPM. For what we are string to accomplish there already exists a plugin called [grunt-contrib-jst](https://github.com/gruntjs/grunt-contrib-jst).

### Application Changes for Grunt Task 

Once you are familiar with Grunt and the purpose of the `package.json` file, then you may install this plugin with this command:

```shell
npm install grunt-contrib-jst --save-dev
```

This command will install the grunt-contrib-jst plugin and update your local `package.json` file with it so that others that pull down your repo can run an `npm install` and have it automatically installed.

Your new `package.json` should look like this:

```javascript
{
  "devDependencies": {
    "grunt": "^0.4.5",
    "grunt-contrib-jst": "^0.6.0"
  }
}
```

The next thing that needs to be done is to create a folder called `templates`. Create this folder at the root of your workspace.

In the `index.html`, cut the `user-list-template` out of the `index.html` file and paste it into its own file called `user-list.tpl` and save it to the templates folder.  When doing this do not include the `<script>` tag as the template file that you created is no longer a script embedded in the HTML.  Below is what you should have in the `user-list.tpl` file.

```html
<a href="#/new" class="btn btn-primary">New User</a>
<hr />
<table class="table table-striped">
<thead>
  <tr>
    <th>First Name</th>
    <th>Last Name</th>
    <th>Age</th>
    <th></th>
  </tr>
</thead>
<tbody>
  <% _.each(users, function(user) { %>
    <tr>
      <td><%= user.get('firstname') %></td>
      <td><%= user.get('lastname') %></td>
      <td><%= user.get('age') %></td>
      <td><a href="#/edit/<%= user.id %>" class="btn">Edit</a></td>
    </tr>
  <% }); %>
</tbody>
```

Do the same thing for the `edit-user-template` and call it `edit-user.tpl`.  

Since we will be pre-compiling the templates before running the application, the `init` function is no longer needed so it can be removed as well as the call to it in the `window.onload = init` line.  The `createTemplate` function will still be needed but will need to change a bit to account for the differences in how the Grunt task is creating the JST property. The JST property will contain an object of key/value pairs where the key is the path to the template file and the value will be the pre-compiled template function. The new `createTemplate` will change to this:

```javascript
function createTemplate(templateName, data) {
  var templatePath = './templates/' + templateName + '.tpl';
  var templateString = window['JST'][templatePath](data);
  return templateString;
}
```

Notice the first argument to the `createTemplate` is different. It now requires the path within the `template` folder of where the `tpl` file is, instead of the name of the script tag. The second argument, the model, remains the same.

### Grunt Task Configuration

Now the configuration of the grunt-contrib-jst Grunt plugin needs to be setup.
Create a new file in the root of your workspace called `Gruntfile.js`.  Copy the below contents into the file and save.

```javascript
'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    jst: {
      compile: {
        files: {
          "scripts/templates.js": ["./templates/**/*.tpl"]
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jst');
};
```

The section starting with `jst` is the configuration that needs to be customized based on the project. For this project we want to look in the templates folder or any sub-folders for any file with the extension of tpl (`./templates/**/*.tpl`).
The file that will be generated will be called `template.js` and be placed in the scripts folder.
The last addition to the Gruntfile is to add the loadNpmTasks for this plugin: `grunt.loadNpmTasks('grunt-contrib-jst');`. This tells grunt to enable the plugin.

For more details around the contents of the [Gruntfile.js](http://gruntjs.com/getting-started#the-gruntfile) file follow the link.

Now running `grunt jst` in the shell will generate a pre-compiled `template.js` file in the scripts folder of the project.

The last change that needs to be made is to include the new `templates.js` file in our index.html file.

```html
<script src="scripts/templates.js"></script>
```

Add the above line to the scripts section of the index.html file. The scripts section will look like this:

```html
    <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min.js"></script>
    <script src="scripts/templates.js"></script>
    <script>
      ...
```

### Setup Application for Testing Pre-compilation Using Grunt

Now you can open the web application using a local web server to see that the app works as it did before.  Use `http-server` and browse to `localhost:8080` to bring up the application.  See [Step 1: Precompiling Underscore Templates](#user-content-step-1-precompiling-underscore-templates) for an explanation of how to install/use `http-server`.

__Note:__ Opening the index.html file will not work.  It will not be able to find some of the JavaScript libraries.


## Step 3: Convert from Underscore templates to Handlebars
This step builds upon what was covered in the [Grunt Task for Precompiled Templates](#user-content-step-2-grunt-task-for-precompiled-templates) step, so you can build upon the contents of the `1-inline-precompiled-templates` folder.  The completed code for this step can be found in the `3-convert-from-underscore-to-handlebars` folder.

### Handlebars Introduction

The next step in our process is to switch to a different templating library. While underscore templating was sufficient for this smaller demo application, enterprise applications may find the need to do more complicated expressions in templates.  [Handlebars](http://handlebarsjs.com) provides the ability to create custom helper methods to do more complicated expressions.  It also provides the ability to change the context that is supplied to a template.  For more details visit [Handlebars](http://handlebarsjs.com).

### Application Changes for Handlebars

The first step to converting to handlebars is to pull in the handlebars library into our application.  We can do this a few different ways.  We can continue to use the method that Thomas Davis used where he pointed to [cdnjs](http://cdnjs.com) to provide the handlebars library by including `//cdnjs.cloudflare.com/ajax/libs/handlebars.js/1.3.0-alpha.4/handlebars.min.js` in the list of scripts in the index.html.  An enterprise application may want to download and maintain its own library.  For this tutorial the handlebars library was downloaded and placed in the project `scripts` folder.  [Download the file](http://builds.handlebarsjs.com.s3.amazonaws.com/handlebars.runtime-v1.3.0.js) now and place it in the `scripts` folder.

__Note:__ The version of handlebars may differ from what is presented here.  Be mindful of this when adding the script tag in the next step.

Once the handlebars library is downloaded, it needs to be included in the application.  Add the below line to the list of scripts in `index.html`.

```html
<script src="scripts/handlebars.runtime-v1.3.0.js"></script>
```

The scripts section should now look like this:

```html
    <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min.js"></script>
    <script src="scripts/handlebars.runtime-v1.3.0.js"></script>
    <script src="scripts/templates.js"></script>
```

The next thing we need to do is change our templates to use handlebars syntax. This tutorial does not include the specifics of the handlebars syntax.  Look [here](http://handlebarsjs.com) for details about handlebars syntax.

The new `user-list` template should look like this:

```html
  <a href="#/new" class="btn btn-primary">New User</a>
  <hr />
  <table class="table table-striped">
  <thead>
    <tr>
      <th>First Name</th>
      <th>Last Name</th>
      <th>Age</th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    {{#each users}}
    <tr>
      <td>{{this.attributes.firstname}}</td>
      <td>{{this.attributes.lastname}}</td>
      <td>{{this.attributes.age}}</td>
      <td><a href="#/edit/{{this.attributes.id}}" class="btn">Edit</a></td>
    </tr>
    {{/each}}
  </tbody>
</table>
```

Also it is a convention to name handlebars files using a `.handlebars` or for short `.hbs` extension.  Rename `user-list.tpl` to `user-list.hbs` now.

The `edit-user` template also needs to change.  The new `edit-user` template should look like this:

```html
<form class="edit-user-form">
  <legend>{{#if user}}Update{{else}}Create{{/if}} User</legend>
  <label>First Name</label>
  <input type="text" name="firstname" value="{{#if user}}{{user.attributes.firstname}}{{/if}}"/>
  <label>Last Name</label>
  <input type="text" name="lastname" value="{{#if user}}{{user.attributes.lastname}}{{/if}}"/>
  <label>Age</label>
  <input type="text" name="age" value="{{#if user}}{{user.attributes.age}}{{/if}}"/>
  <hr />
  <button type="submit" class="btn">{{#if user}}Update{{else}}Create{{/if}}</button>
  {{#if user}}
    <input type="hidden" name="id"  value="{{user.id}}" />
    <button class="btn btn-danger delete">Delete</button>
  {{/if}}
</form>
```

Rename `edit-user.tpl` to `edit-user.hbs` now.

### Grunt Task Configuration for Handlebars

The next step is to pre-compile our handlebars templates so that they can be used in our application.  To do this we need to use a different Grunt plugin.  The plugin [grunt-contrib-handlebars](https://github.com/gruntjs/grunt-contrib-handlebars) is what we need to pre-compile handlebars templates.  Run this command on the command line to un-install and remove grunt-contrib-jst from the `package.json` file.

```shell
npm uninstall grunt-contrib-jst --save-dev
```

Now run the following command to install grunt-contrib-handlebars and put it in your `devDependencies` of your `package.json` file.

```shell
npm install grunt-contrib-handlebars --save-dev
```

The `devDependencies` section of the new package.json file should look like this:

```javascript
  "devDependencies": {
    "grunt": "~0.4.5",
    "grunt-contrib-handlebars": "~0.8.0",
  }
```

Now we have to setup the configuration for our handlebars templates.  To do this we need to modify the `Gruntfile.js` file.  Open this file and remove the section for `jst`.  Now we need to add a section called `handlebars`.  The configuration will be similar to what was there for `jst`, but now there are `.hbs` files instead of `.tpl` files in our templates folder.  The configuration for handlebars in our Gruntfile.js should now look like this:

```javascript
    handlebars: {
      all: {
        files: {
          "scripts/templates.js": ["templates/**/*.hbs"]
        }
      }
    }
```

### Setup Application for Testing Handlebars

Now we can run `grunt handlebars` at the command line and have it generate a `templates.js` file in our scripts folder.  Once that completes, test the application using `http-server` and browsing to `localhost:8080` as is described above in [Step 1: Precompiling Underscore Templates](#user-content-step-1-precompiling-underscore-templates).  Ensure that it still works the same as it did before.

## Step 4: Convert to CommonJS Modules with browserify
This step builds upon what was covered in the [Convert from Underscore templates to Handlebars](#user-content-step-3-convert-from-underscore-templates-to-handlebars) step, so you can build upon the contents of the `3-convert-from-underscore-to-handlebars` folder.  The completed code for this step can be found in the `4-convert-to-use-browserify` folder.

### Browserify Introduction

The current state of the application is not very maintainable or extensible.  All the JavaScript is embedded in the single HTML file and most variables have global window scope.  The application is small now and fairly easy to change, but if features were to be added to this application, it can grow rather quickly and become cumbersome to manage.  So before it gets to that state, it would be nice to make it more maintainable and extensible by modularizing the code.  If this were a Node.js application, it would be using CommonJS modules to organize each object in its individual file.  We can utilize these modules in the browser by using [browserify](http://browserify.org/).  Browserify can be installed using the following command:

```shell
  npm install -g browserify
```

or

```shell
  sudo npm install -g browserify
```

### Application Changes for Browserify

To convert what we have to using modules we have to logically break out the JavaScript that we have inline in `index.html` and put it into seperate files.  There are a number of Backbone objects that can be pulled out.  There is a collection, model, two views and a router.  Each one of these can be put into their own file.  The way we write a module is by wrapping the code in a `module.exports = function(arg1, arg2)` function.  To do the user management users collection in a module, the  code will look like this:

```javascript
module.exports = Backbone.Collection.extend({
  url:  '/users'
});
```

This can be saved to a file called `users.js`.  It would make sense to also organize the modules by type so it is easy to find later.  Since it is a JavaScript file, save it to a new folder called `collections` that is created in the `scripts` folder.  We will do the same for models, views, and routers.  The scripts tree structure will look like this after all modules are created:

```shell
├── scripts
│   ├── application.js
│   ├── collections
│   │   └── users.js
│   ├── handlebars.runtime-v1.3.0.js
│   ├── models
│   │   └── user.js
│   ├── routers
│   │   └── application.js
│   ├── templates.js
│   ├── user-management.js
│   └── views
│       ├── edit-user.js
│       └── user-list.js
```

If this structure does not already exist in your warkspace, create it now.  Here is what each file will look like when each of the modules are created:

The `user.js` model should now look like this:

```javascript
module.exports = Backbone.Model.extend({
  urlRoot: '/users'
});
```

The `user-list` view is a little more involved.  Start by copying the view to the new file and adding `module.exports = ` in place of `var Users`.  But now it needs to be considered that the view uses the `users` collection.  So the `user-list` view module needs to know about the `users` collection module.  This is where the `require` statement comes in.  We use the `require` statement to tell a module that it is using another module.  The `require` statement takes an argument of the relative path to the module that it is requiring.  Since the view is in the `views` folder and it needs to reference a collection in the `collections` folder, the argument will look like this `'../collections/collection-name'`.  The below statement needs to be added to the top of the `user-list` view module.

```javascript
var Users = require('../collections/users');
```

The `user-list.js` file will look like this:

```javascript
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
```

There is a similar issue when modularizing the `edit-user` view.  It needs to know about the `user` model.  So once again a `require` statement is needed to make the view aware of the model.  The `edit-user.js` file will look like this:

```javascript
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
```

Now modularize the main portion of the application into an `application.js` file that is located at the root of your workspace in the `scripts` folder.  This will include the JavaScript code that follows the functions in the inline JavaScript code.  Also since all of the Backbone objects were cut out of the `index.html` file, it is necessary to make a few more code changes to require the modules that are used here.  The following `requires` are needed above where the Backbone views and routers are used. 

```javascript
  var UserList = require('./scripts/views/user-list');
  var EditUser = require('./scripts/views/edit-user');
  var Router = require('./scripts/routers/application');
```

The complete `application.js` file will look like this:

```javascript
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
```

### Running Browserify Command

Once all of the modules are in place, we need to bundle up the modules into a single JavaScript file.  This can be achieved by running the following command from the root of your workspace.

```shell
browserify ./scripts/application.js -o ./scripts/user-management.js
```

What this command does is combine all of the modules into one JavaScript file called `user-management.js`.  Once this command is executed successfully it needs to be added to the `index.html` file.  Add the below line to the `index.html` file as the last script included, immediately after the inline script.

```html
    <script src="scripts/user-management.js"></script>
```

There is one additional change necessary to make in the `index.html` file.  This change is to the two jQuery functions that we currently have: `$.ajaxPrefilter` and `$.fn.serializeObject`.  We need to ensure that `jQuery` is ready to handle these functions before we try to define them.  This can be done by wrapping them with a `$(document).ready()` function.

The inline script will now look like this:

```html
    <script>
      function createTemplate(templateName, data) {
        var templatePath = 'templates/' + templateName + '.hbs';
        var templateString = window['JST'][templatePath](data);
        return templateString;
      }

      $(document).ready(function() {
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
      });
    </script>
```

### Setup Application for Testing Browserify

Once all of the above steps are complete, test the application using `http-server` and browsing to `localhost:8080` as is described above in step 1.  Ensure that it still works the same as it did before.


## References
  - [backbone.js](http://backbonejs.org)
  - [backbonetutorials.com](http://backbonetutorials.com/)
  - [browserify](http://browserify.org)
  - [Grunt](http://gruntjs.com)
  - [grunt-contrib-handlebars](https://github.com/gruntjs/grunt-contrib-handlebars)
  - [grunt-contrib-jst](https://github.com/gruntjs/grunt-contrib-jst)
  - [Handlebars](http://handlebarsjs.com)
  - [Node](http://nodejs.org)
  - [Underscore](http://underscorejs.org)
