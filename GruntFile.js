'use strict';

module.exports = function (grunt) {

  // configurable paths
  grunt.initConfig({
    connect: {
      server: {
        options: {
          port: 3123,
          base: './app'
        }
      }
    },
    watch: {
      files: ['app/**/*.less'],
      tasks: 'less'
    },
    less: {
      dev: {
        options: {},
        files: {
          "beta/css/_styles.css": "beta/less/styles.less"
        }
      }
    }
  });


  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('start', ['less:dev', 'connect', 'watch']);

};

