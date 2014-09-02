'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    jst: {
      compile: {
        files: {
          "templates.js": ["./templates/**/*.tpl"]
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jst');
};
