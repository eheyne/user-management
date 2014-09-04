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
