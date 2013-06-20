'use strict';

module.exports = function (grunt) {

  // configurable paths
  grunt.initConfig({
    watch: {
      files: ['dev/**/*.less'],
      tasks: 'less'
    },
    less: {
      dev: {
        options: {},
        files: {
          "dev/css/styles-v2.css": "dev/less/styles.less"
        }
      }
      ,
      build: {
        options: {},
        files: {
          "build/css/styles-v2.css": "build/less/styles.less"
        }
      }
    },
    requirejs: {
      compile: {
        options: {
          almond: true,
          baseUrl: "dev/js",
          include:['main'],
          mainConfigFile: "dev/js/config.js",
          preserveLicenseComments: false,
          out: "build/js/main1_2.js"
        }
      }
    },
    copy:{
      main : {
        files : [
          {expand: true, cwd : 'dev/', src: ['**'], dest: 'build/'}
        ]
      }
    },
    replace: {
      js:{
        src: ['build/index.html'],
        overwrite: true,
        replacements: [{
          from: /<!-- replace-script -->([.\r\n\s])*<.*\n\s*<[\w\s=\"\./><]*!-- end-replace -->/mgi,
          to: '<script src="./js/main1_2.js"></script>'
        }]
      }
    },
    clean : {
      build : [
        'build/less'
      ]
    }
  });


  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-requirejs');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('start', ['less:dev', 'connect', 'watch']);
  grunt.registerTask('watch:dev', ['less:dev', 'watch']);

  grunt.registerTask('build', ['copy', 'replace', 'requirejs', 'less:build', 'clean:build']);

};

