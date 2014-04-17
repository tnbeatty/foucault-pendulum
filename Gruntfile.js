'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    connect: {
      server: {
        options: {
          port: 9001,
          base: '',
          keepalive: true
        }
      }
    },
    watch: {
      compass: {
        files: ['sass/**/*.scss'],
        tasks: ['compass:dev']
      },
      jade: {
        files: ['jade/**/*.jade'],
        tasks: ['jade:dev']
      }
    },
    compass: {
      dev: {
        options: {
          config: 'config.rb',
          environment: 'production'
        }
      }
    },
    jade: {
      dev: {
        options: {

        },
        files: {
          'index.html': 'jade/index.jade'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-jade');

  grunt.registerTask('build', [
    'compass:dev',
    'jade:dev'
  ]);

  grunt.registerTask('default', ['build']);

  grunt.registerTask('serve', ['connect']);
}
