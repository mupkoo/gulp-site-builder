/* jslint node: true */
var gulp         = require('gulp');
var gulpSequence = require('gulp-sequence');
var del          = require('del');
var browserSync  = require('browser-sync').create();
var source       = require('vinyl-source-stream');
var buffer       = require('vinyl-buffer');
var sourcemaps   = require('gulp-sourcemaps');
var sass         = require('gulp-sass');
var browserify   = require('browserify');
var babelify     = require('babelify');
var responsive   = require('gulp-responsive');
var images       = require('./config/images');
var rev          = require('./config/rev');
var revReplace   = require('gulp-rev-replace');

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

gulp.task('images:dev', function () {
    return gulp.src('app/images/**/*.{png,jpg,jpeg,gif,svg}', { base: 'app' })
        .pipe(responsive(images.images, images.config))
        .pipe(gulp.dest('tmp'));
});

gulp.task('clean:dist', function () {
    return del(['dist/*']);
});

gulp.task('javascripts:dist', function () {
    return browserify('app/javascripts/app.js')
        .transform(babelify)
        .bundle()
        .pipe(source('javascripts/app.js'))
        .pipe(buffer())
        .pipe(rev());
});

gulp.task('styles:dist', function () {
    var manifest = gulp.src('dist/rev-minifest.json');

    return gulp.src('app/styles/app.scss', { base: 'app' })
        .pipe(sass())
        .pipe(revReplace({ manifest: manifest }))
        .pipe(rev());
});

gulp.task('images:dist', function () {
    return gulp.src('app/images/**/*.{png,jpg,jpeg,gif,svg}', { base: 'app' })
        .pipe(responsive(images.images, images.config))
        .pipe(rev());
});

gulp.task('html:dist', function () {
    var manifest = gulp.src('dist/rev-minifest.json');

    return gulp.src('app/*.html')
        .pipe(revReplace({ manifest: manifest }))
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', function () {
    gulp.watch('app/javascripts/**/*.js', ['javascripts:dev:reload']);
    gulp.watch('app/styles/**/*.scss', ['styles:dev']);
    gulp.watch('app/images/**/*', ['images:dev']).on('change', browserSync.reload);
    gulp.watch('app/**/*.html').on('change', browserSync.reload);
});

gulp.task('serve', ['javascripts:dev', 'styles:dev', 'images:dev', 'watch'], function () {
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

gulp.task('build', gulpSequence(
    'clean:dist',
    'images:dist',
    'javascripts:dist',
    'styles:dist',
    'html:dist'
));

gulp.task('default', ['serve']);
