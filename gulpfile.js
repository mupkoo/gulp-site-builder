/* jslint node: true */
var gulp         = require('gulp');
var browserSync  = require('browser-sync').create();
var source       = require('vinyl-source-stream');
var sourcemaps   = require('gulp-sourcemaps');
var sass         = require('gulp-sass');
var browserify   = require('browserify');
var babelify     = require('babelify');

gulp.task('javascripts:dev', function () {
    return browserify('app/javascripts/app.js')
        .transform(babelify)
        .bundle()
        .pipe(source('javascripts/app.js'))
        .pipe(gulp.dest('tmp'));
});

gulp.task('javascripts:dev:reload', ['javascripts:dev'], browserSync.reload);

gulp.task('styles:dev', function () {
    return gulp.src('app/styles/app.scss', { base: 'app' })
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write({
            includeContent: false,
            sourceRoot: '/'
        }))
        .pipe(gulp.dest('tmp'))
        .pipe(browserSync.stream());
});

gulp.task('watch', function () {
    gulp.watch('app/javascripts/**/*.js', ['javascripts:dev:reload']);
    gulp.watch('app/styles/**/*.scss', ['styles:dev']);
    gulp.watch('app/**/*.html').on('change', browserSync.reload);
});

gulp.task('serve', ['javascripts:dev', 'styles:dev', 'watch'], function () {
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
