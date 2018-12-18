const gulp = require('gulp');
const uglify = require('gulp-uglify');
const path = require('path');

gulp.task('default', function() {
  return gulp.src(path.resolve(__dirname, '../static/base.js'))
    .pipe(uglify({ mangle: false }))
    .pipe(gulp.dest(path.resolve(__dirname, '../dist')));
});
