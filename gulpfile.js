/* jslint node: true */
var gulp         = require('gulp');
var gulpSequence = require('gulp-sequence');
var del          = require('del');
var browserSync  = require('browser-sync').create();
var source       = require('vinyl-source-stream');
var buffer       = require('vinyl-buffer');
var browserify   = require('browserify');
var babelify     = require('babelify');
var uglify       = require('gulp-uglify');
var sourcemaps   = require('gulp-sourcemaps');
var sass         = require('gulp-sass');
var uncss        = require('gulp-uncss');
var autoprefixer = require('gulp-autoprefixer');
var nano         = require('gulp-cssnano');
var nunjucks     = require('gulp-nunjucks-render');
var htmlmin      = require('gulp-html-minifier');
var responsive   = require('gulp-responsive');
var imagemin     = require('gulp-imagemin');
var pngquant     = require('imagemin-pngquant');
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
        .pipe(autoprefixer())
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

gulp.task('html:dev', function () {
    nunjucks.nunjucks.configure(['app/'], { watch: false });

    return gulp.src(['app/**/*.html', '!app/layouts/**/*.html'], { base: 'app' })
        .pipe(nunjucks())
        .pipe(gulp.dest('tmp'));
});

gulp.task('html:dev:reload', ['html:dev'], browserSync.reload);

gulp.task('clean:dist', function () {
    return del(['dist/*']);
});

gulp.task('javascripts:dist', function () {
    return browserify('app/javascripts/app.js')
        .transform(babelify)
        .bundle()
        .pipe(source('javascripts/app.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(rev());
});

gulp.task('styles:dist', function () {
    var manifest = gulp.src('dist/rev-minifest.json');

    return gulp.src('app/styles/app.scss', { base: 'app' })
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(uncss({
            html: ['app/index.html']
        }))
        .pipe(nano())
        .pipe(revReplace({ manifest: manifest }))
        .pipe(rev());
});

gulp.task('images:dist', function () {
    return gulp.src('app/images/**/*.{png,jpg,jpeg,gif,svg}', { base: 'app' })
        .pipe(responsive(images.images, images.config))
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            use: [pngquant()]
        }))
        .pipe(rev());
});

gulp.task('html:dist', function () {
    var manifest = gulp.src('dist/rev-minifest.json');

    nunjucks.nunjucks.configure(['app/'], { watch: false });

    return gulp.src(['app/**/*.html', '!app/layouts/**/*.html', '!app/shared/**/*.html'], { base: 'app' })
        .pipe(nunjucks())
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(revReplace({ manifest: manifest }))
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', function () {
    gulp.watch('app/javascripts/**/*.js', ['javascripts:dev:reload']);
    gulp.watch('app/styles/**/*.scss', ['styles:dev']);
    gulp.watch('app/images/**/*', ['images:dev']).on('change', browserSync.reload);
    gulp.watch('app/**/*.html', ['html:dev:reload']);
});

gulp.task('serve', ['javascripts:dev', 'styles:dev', 'images:dev', 'html:dev', 'watch'], function () {
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
