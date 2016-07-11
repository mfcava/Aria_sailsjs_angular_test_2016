/**
 * `compileAssets`
 *
 * ---------------------------------------------------------------
 *
 * This Grunt tasklist is not designed to be used directly-- rather
 * it is a helper called by the `default`, `prod`, `build`, and
 * `buildProd` tasklists.
 *
 * For more information see:
 *   http://sailsjs.org/documentation/anatomy/my-app/tasks/register/compile-assets-js
 *
 */
module.exports = function(grunt) {
  grunt.registerTask('compileAssets', [
    'clean:dev',
    'jst:dev',
    'less:dev',
    // --- Custom tasks
        // Add for SASS compiling
        'sass:dev',
        // Add for JADE compiling
        'cssmin',
        'jade:dev',
        // Add for HTML minify
        'htmlmin:dev',
    // --- End Custom tasks
    'copy:dev',
    'coffee:dev'
  ]);
};
