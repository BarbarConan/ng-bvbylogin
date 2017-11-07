var gulp = require('gulp');
var browser = require('browser-sync');
var port = process.env.SERVER_PORT || 3000;

gulp.task('serve', function () {
    browser.init({
        server: './',
        port: port
    });

});

gulp.task('files', function () {
    gulp.watch(['./css/*', './js/*', './index.html'], ['', browser.reload]);    
});

gulp.task('default', ['serve', 'files']);