/* jslint node: true */
var gulp         = require('gulp');
var browserSync  = require('browser-sync').create();

gulp.task('serve', [], function () {
    browserSync.init({
        port: 8091,
        ui: {
            port: 8092
        },
        server: {
            baseDir: ['tmp', 'app']
        }
    });
});

gulp.task('default', ['serve']);
