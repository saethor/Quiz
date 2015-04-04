'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
 
gulp.task('styles', function () {
    return gulp.src('App/Styles/main.scss')
        .pipe(sass({errLogToConsole: true}))
        .pipe(autoprefixer('last 1 version'))
        .pipe(gulp.dest('App/Styles'))
});

gulp.task('watch', function () {
 
    // watch for changes
    gulp.watch('App/Styles/**/*.scss', ['styles']);
});


