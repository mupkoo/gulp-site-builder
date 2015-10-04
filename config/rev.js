/* jslint node: true */
var gulp         = require('gulp');
var lazypipe     = require('lazypipe');
var rev          = require('gulp-rev');

var revTask = lazypipe()
    .pipe(rev)
    .pipe(gulp.dest, 'dist')
    .pipe(rev.manifest, 'dist/rev-minifest.json', {
        base: process.cwd() + '/dist',
        merge: true
    })
    .pipe(gulp.dest, 'dist');

module.exports = revTask;
