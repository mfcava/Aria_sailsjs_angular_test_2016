/**
 * `syncAssets`
 *
 * ---------------------------------------------------------------
 *
 * This Grunt tasklist is not designed to be used directly-- rather
 * it is a helper called by the `watch` task (`tasks/config/watch.js`).
 *
 * For more information see:
 *   http://sailsjs.org/documentation/anatomy/my-app/tasks/register/sync-assets-js
 *
 */
module.exports = function(grunt) {
  grunt.registerTask('syncAssets', [
    'jst:dev',
    'less:dev',
    // Add for SASS compiling
    'sass:dev',
    // Add for JADe compiling
    'jade:dev',
    'sync:dev',
    'coffee:dev'
  ]);
};
