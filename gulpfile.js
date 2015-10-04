/* jslint node: true */
var gulp         = require('gulp');
var browserSync  = require('browser-sync').create();
var sass         = require('gulp-sass');

gulp.task('styles:dev', function () {
    return gulp.src('app/styles/app.scss', { base: 'app' })
        .pipe(sass())
        .pipe(gulp.dest('tmp'))
        .pipe(browserSync.stream());
});

gulp.task('watch', function () {
    gulp.watch('app/styles/**/*.scss', ['styles:dev']);
});

gulp.task('serve', ['styles:dev', 'watch'], function () {
    browserSync.init({
        port: 8091,
        open: false,
        ui: {
            port: 8092
        },
        server: {
            baseDir: ['tmp', 'app']
        }
    });
});

gulp.task('default', ['serve']);
