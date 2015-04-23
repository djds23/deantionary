'use strict';

var watchify = require('watchify');
var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var babelify = require('babelify');
var assign = require('lodash.assign');

gulp.task('javascript', function () {
  // set up the browserify instance on a task basis
  var b = browserify('./static/js/app.jsx', assign({
    debug: true,
    // defining transforms here will avoid crashing your stream
  }, watchify.args));
  b.transform(babelify);
  b = watchify(b);
  b.on('update', bundle);

  function bundle () { 
    return b.bundle()
      .pipe(source('main.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
          // Add transformation tasks to the pipeline here.
          .pipe(uglify())
          .on('error', gutil.log)
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./static/js/'));
  }
  return bundle();
});

gulp.task('default', ['javascript']);