# User Management

## Table of Contents
  - [Overview](#user-content-overview)
  - [Precompiling Underscore Templates](#user-content-precompiling-underscore-templates)
  - [Grunt task for Precompiled Templates](#user-content-grunt-task-for-precompiled-templates)
  - [Convert from Underscore templates to Handlebars](#user-content-convert-from-underscore-templates-to-handlebars)
  - [References](#user-content-references)

## Overview
This tutorial was put in place to grow a base backbone application to a ready to deploy Single Page Application (SPA).  It starts with a basic backbone.js application with CRUD functionality that uses templates.  It builds on the application built by [Thomas Davis](thomasdav.is) in this [video](https://www.youtube.com/watch?v=FZSjvWtUxYk) and incrementally adds features. There is an `index.html` file at the root of this repo.  It is the finished product from this video.  If this is all new to you, I encourage you to follow along with the video and build the application yourself.  If you already have some basic backbone.js understanding and want to move forward with this tutorial then you can use the base application provided here.

The process of building up a deployable application includes making the source code maintainable, testing the code, making the end product performant, and minification of the finished product.  A number of JavaScript libraries exist to help achieve these goals. One library, [Grunt](gruntjs.com), exists to aid a developer in building such a product by providing a means for defining and executing tasks.  As you go through each step in the tutorial you will learn about new libraries and what services they provide.  You will also learn how to setup Grunt tasks to make the use of these libraries transparent to other deveopers.  This tutorial is designed so that you can go through each step start to finish or jump to a single step if you are looking for something specific.  Each step in this tutorial is built on the previous step.  The source code is broken down into sub-directories of the form `1-Name of Step`, `2-Name of next step`, etc.  This allows you to see the incremental steps taken to get to the finished product.  It also allows you to compare the source code with the previous steps.

I hope you find this tutorial helps you with your JavaScript product development workflow.

## Precompiling Underscore Templates
As mentioned in the [Overview](#user-content-overview) the base application uses backbone and one of the dependencies of Backbone is [Underscore](underscorejs.org). Underscore is a JavaScript library that provides many helpful functions.  One of which is a function called `template` that will precompile an HTML template into a JavaScript function, which can be used for plugging in dynamic content to the markup. This application defines templates inside of a `script` tag.  

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

A common practice today in building SPAs is to remove the processing of templates from being real time to pre-compiling them before they are needed.  This step in the tutorial we will take that compilation and move it into an application load event so that when the template is requested it is already compiled and ready for use. 

In order to do this we will need a couple new functions.

```javascript
  function init() {
    window.JST = {
      'user-list' : _.template($('#user-list-template').html()).source,
      'edit-user' : _.template($('#edit-user-template').html()).source
    };
  }
  
  function createTemplate(name, model) {
    var template = window.JST[name];
    var func = eval('[' + template + ']')[0];
    return func(model);
  }

  window.onload = init;
```

The first function `init` will create an object called `JST` and put it on the `window` object.  Notice that the object is built by using a key with the same name as the template and the value will be the pre-compiled template source.

The second function `createTemplate` will replace the call to `_.template` inside of our backbone view.  The new view code will look like this:

```javascript
  var template = createTemplate('user-list', {users: users.models});
  this.$el.html(template);
```

This code is very similar to the actual call to undersocres `template` function differing only in the first argument were we only need to pass the name of the template that we want to load.

Also notice after the two functions definitions we call `window.onload = init;` so that on the window load event we call our new init function. This is a way to pre-compile the templates before they are needed in the views. This however does still compile them when the application is run.  It just does it on application start rather than while navigating through the app.  The source code for this step is located in the folder `1-inline-precompiled-templates`. As stated in the [Overview](#user-content-overview) this tutorial takes small incremental steps to help you better understand what is going on behind the scenes. The next step in the tutorial will show how with `Grunt` we can do this before the application is loaded.

## Grunt Task for Precompiled Templates
To pre-compile templates outside of the application we will use [Grunt](http://gruntjs.com/). Grunt requires [Node](nodejs.org) to be installed.

If you do not already have it, please install [Node](nodejs.org) now.

After Node is installed, you can install Grunt globally with the following command:

```shell
npm install -g grunt-cli
```

If you have not used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started guide](http://gruntjs.com/getting-started), as it explains how to create a Gruntfile as well as install and use Grunt plugins. Pay special attention on the section where it talks about the `package.json` file as we will need to create one for this part of the project. For this exercise we can just create the `package.json` file and put an empty JavaScript object in it `{  }` for now and use `npm` commands to add to it later.

Grunt allows the use of plugins. a Grunt plugin is a Node package that can be published via NPM. For what we are tring to accomplish there already exists a plugin called [grunt-contrib-jst](https://github.com/gruntjs/grunt-contrib-jst).

Once you are familiar with Grunt and the purpose of the package.json file, then you may install this plugin with this command:

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

The next thing that needs to be done is to create a folder called `templates`. Create this folder at the root of the project step.

In the `index.html`, cut the `user-list-template` out of the `index.html` file and paste into its own file called `user-list.tpl` and save it to the templates folder.  Do the same thing for the `edit-user-template` and call it `edit-user.tpl`.  When doing this do not include the `script` tag as the template file that you created is no longer a script embedded in the HTML.

Since we will be pre-compiling the templates before running the application, the `init` function is no longer needed so go it can be removed. The createTemplate function will still be needed but will now read the templates from a property off of `window` called JST. The JST property will contain key/value pairs where the key is the path to the template file and the value will be the pre-compiled template function. The new createTemplate will change to this:

```javascript
function createTemplate(templateName, data) {
  var templatePath = './templates/' + templateName + '.tpl';
  var templateString = window['JST'][templatePath](data);
  return templateString;
}
```

Notice the first argument to the createTemplate is different. It now requires the path within the template folder of where the `tpl` file is, instead of the name of the script tag. The second argument, the model, remains the same.

Now the configuration of the grunt-contrib-jst Grunt plugin needs to be setup.
Create a new file at the root of the project called Gruntfile.js.  Copy the below contents into the file and save.

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
The file that will be generated will be called `template.js` and be placed in the root folder.
The last addition to the Gruntfile is to add the loadNpmTasks for this plugin: `grunt.loadNpmTasks('grunt-contrib-jst');`. This tells grunt to enable the plugin.

For more details around the contents of the [Gruntfile.js](http://gruntjs.com/getting-started#the-gruntfile) file follow the link.

Now running `grunt jst` in the shell will generate a pre-compiled `template.js` file in the scripts folder of the project.

The last change that needs to be made is to include the new `templates.js` file in our index.html file.

```html
<script type="text/javascript" src="scripts/templates.js"></script>
```

Add the above line to the scripts section of the index.html file. The scripts section will look like this:

```html
    <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min.js"></script>
    <script type="text/javascript" src="scripts/templates.js"></script>
```

Now you can open the web application using a local web server to see that the app works as it did before.

Note: Opening the index.html file will not work.  It will not be able to find some of the javascript libraries.


## Convert from Underscore templates to Handlebars

The next step in our process is to swtich to a different templating library. While underscore templating was sufficient for this smaller demo application, enterprise applications may find the need to do more complicated expressions in templates.  [Handlebars](http://handlebarsjs.com) provides the ability to create custom helper methods to do more complicated expressions.  It also provides the ability to change the context that is supplied to a template.  For more details visit [Handlebars](http://handlebarsjs.com).

The first step to converting to handlebars is to pull in the handlebars library into our application.  We can do this a few different ways.  We can continue to use the method that Thomas Davis used where he pointed to [cdnjs](http://cdnjs.com) to provide the handlebars library by including `//cdnjs.cloudflare.com/ajax/libs/handlebars.js/2.0.0-alpha.4/handlebars.min.js` in the list of scripts in the index.html.  An enterprise application may want to download and maintain its own library.  For this tutorial the handlebars library was downloaded and placed in the project `script` folder.

Once the handlebars library is downloaded, it needs to be included in the application.  Add the below line to the list of scripts in `index.html`.

```html
<script type="text/javascript" src="scripts/handlebars.runtime-v1.3.0.js"></script>
```

The scripts section should now look like this:

```html
    <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min.js"></script>
    <script type="text/javascript" src="scripts/handlebars.runtime-v1.3.0.js"></script>
    <script type="text/javascript" src="scripts/templates.js"></script>
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
    "grunt-contrib-handlebars": "~0.8.0"
  }
```

Now we have to setup the configuration for our handlebars templates.  To do this we need to modify the `Gruntfile.js` file.  Open this file and remove the section for `jst`.  Now we need to add a section called `handlebars`.  The configuration will be similar to what was there for jst, but now there are `.hbs` files instead of `.tpl` files in our templates folder.  The configuration for handlebars in our Gruntfile.js should now look like this:

```javascript
    handlebars: {
      all: {
        files: {
          "scripts/templates.js": ["templates/**/*.hbs"]
        }
      }
    }
```

Now we can run `grunt handlebars` at the command line and have it generate a `templates.js` file in our scripts folder.  Once that completes, test the application and ensure that it still works the same as it did before.



## References
  - [backbone.js](backbone.js)
  - [backbonetutorials.com](http://backbonetutorials.com/)
  - [Grunt](http://gruntjs.com)
  - [grunt-contrib-jst](https://github.com/gruntjs/grunt-contrib-jst)
  - [Handlebars](http://handlebarsjs.com)
  - [Node](nodejs.org)
  - [Underscore](underscorejs.org)
