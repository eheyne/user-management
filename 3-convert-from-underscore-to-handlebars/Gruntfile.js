'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    handlebars: {
      all: {
        files: {
          "templates.js": ["templates/**/*.hbs"]
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-handlebars');
};
