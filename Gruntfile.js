module.exports = function(grunt) {

  var destdir = "/media/data/projects/dynasync_dest/";

  grunt.loadNpmTasks('grunt-sync');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // dynamic config sync's targets for every dir except for node_modules
  grunt.registerTask('config_sync', 'dynamically config sync', function() {

    grunt.file.expand({filter: 'isDirectory'},
      ['*', '!node_modules']).forEach(function(dir) {

      // config this dir's sync target
      var sync = grunt.config.get('sync') || {};
      sync[dir] = {
        files: [{
          cwd: dir,
          src: '**/*',
          dest: destdir + dir
        }]
      };
      grunt.config.set('sync', sync);

    });

  });

  // dynamic config watch's targets for every dir except for node_modules
  grunt.registerTask('config_watch', 'dynamically config watch', function() {

    grunt.file.expand({filter: 'isDirectory'},
      ['*', '!node_modules']).forEach(function(dir) {

      // config this dir's watch target
      var watch = grunt.config.get('watch') || {};
      watch[dir] = {
        files: dir + '/**/*',
        // this line solve the problem
        // when find file change, first dynamically config sync and then sync the dir
        tasks: ['config_sync', 'sync:' + dir]
      };
      grunt.config.set('watch', watch);

    });

  });

  grunt.registerTask('syncall', ['config_sync', 'sync']);
  grunt.registerTask('watchall', ['config_watch', 'watch']);
  grunt.registerTask('default', ['watchall']);

};