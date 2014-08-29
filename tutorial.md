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

If you have not used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started guide](http://gruntjs.com/getting-started), as it explains how to create a Gruntfile as well as install and use Grunt plugins. Pay special attention on the section where it talks about the `package.json` file as we will need to create one for this part of project. For this exercise we can just create the `package.json` file and put an empty JavaScript object in it `{  }` for now and use `npm` commands to add to it later.

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

## Convert from Underscore templates to Handlebars


## References
  - [backbone.js](backbone.js)
  - [backbonetutorials.com](http://backbonetutorials.com/)
  - [Underscore](underscorejs.org)
