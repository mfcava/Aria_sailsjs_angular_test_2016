module.exports = function(grunt) {

    grunt.config.set('htmlmin', {
        dev: {
            options: {
                removeComments: true,
                collapseWhitespace: true,
                caseSensitive: true,
            },
            files: [{
                expand: true,
                cwd: '.tmp/public/',
                src: ['**/*.html'],
                dest: '.tmp/public/',
            }]
        }
    });

    grunt.loadNpmTasks('grunt-contrib-htmlmin');

};
