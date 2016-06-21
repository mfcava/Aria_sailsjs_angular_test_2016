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
                cwd: 'assets/partials/',
                src: '*.html',
                dest: '.tmp/public/partials/',
            }]
        }
    });

    grunt.loadNpmTasks('grunt-contrib-htmlmin');

};
