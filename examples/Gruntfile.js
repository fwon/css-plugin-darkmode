'use strict';

const CSSDarkModePlugin = require('../index.js');

module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('../package.json'),
    less: {
      production: {
        options: {
          paths: ['styles/'],
          plugins: [
            new CSSDarkModePlugin()
          ]
        },
        files: {
          '../dist/style.css': 'styles/style.less'
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.registerTask('default', ['less']);
};
