'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
 
gulp.task('styles', function () {
    return gulp.src('App/styles/main.scss')
        .pipe(sass({errLogToConsole: true}))
        .pipe(autoprefixer('last 1 version'))
        .pipe(gulp.dest('App/styles'))
        .pipe(reload({stream:true}));
});

gulp.task('serve', ['styles'], function () {
    browserSync.init(null, {
        server: {
            baseDir: 'App',
            directory: true
        },
        debugInfo: false,
        open: false,
        hostnameSuffix: ".xip.io"
    }, function (err, bs) {
        require('opn')(bs.options.url);
        console.log('Started connect web server on ' + bs.options.url);
    });
});

gulp.task('watch', ['serve'], function () {
 
    // watch for changes
    gulp.watch(['App/*.html'], reload);
 
    gulp.watch('App/styles/**/*.scss', ['styles']);
    gulp.watch('App/scripts/**/*.js', ['scripts']);
    gulp.watch('App/images/**/*', ['images']);
});


