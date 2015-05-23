var gulp = require('gulp'),
    gutil = require('gulp-util'),
    webserver = require('gulp-webserver');

var baseUrl = 'app/';

gulp.task('html', function () {
    gulp.src(baseUrl + '/*.html')
});

gulp.task('js', function () {
    gulp.src(baseUrl + '/*.js')
});

gulp.task('css', function () {
    gulp.src(baseUrl + '/css/*.css')
});

gulp.task('watch', function () {
    gulp.watch(baseUrl + '/js/*.js', ['js']);
    gulp.watch(baseUrl + '/css/*.css', ['css']);
    gulp.watch(baseUrl + '/*.html', ['html']);
});

gulp.task('webserver', function () {
    gulp.src(baseUrl + '/')
        .pipe(webserver({
            livereload: true,
            open: false
        }));
});

gulp.task('default', ['watch', 'html', 'js', 'css', 'webserver']);
