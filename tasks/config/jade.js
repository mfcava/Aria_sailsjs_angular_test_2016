/**
 * `jade`
 *
 * ---------------------------------------------------------------
 *
 * Compile CoffeeScript files located in `assets/js` into Javascript
 * and generate new `.js` files in `.tmp/public/js`.
 *
 * For usage docs see:
 *   https://github.com/gruntjs/grunt-contrib-coffee
 *
 */
module.exports = function(grunt) {

  grunt.config.set('jade', {

    dev: {
        options: {
            pretty: false,
            client: false
            // namespace: 'Templates'
    },
    files: [{
        expand: true,
        cwd: 'assets/',
        src: ['**/*.jade'],
        dest: '.tmp/public/',
        ext: '.html'
    }]
  }

  });

  grunt.loadNpmTasks('grunt-contrib-jade');
};
