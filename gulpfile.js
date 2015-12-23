var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache');
var minifycss = require('gulp-minify-css');
var sass = require('gulp-sass');
var merge = require('merge-stream');

gulp.task('images', function(){
  gulp.src('src/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/images/'));
});

gulp.task('styles', function(){
  gulp.src(['src/styles/**/*.scss'])
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(sass())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/styles/'))
});

gulp.task('scripts', function(){
  return gulp.src('src/scripts/**/*.js')
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(concat('main.js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/scripts/'))
});

gulp.task('options-html', function(){
  gulp.src(['src/options/**/*.html'])
    .pipe(gulp.dest('dist/options/'))
});

gulp.task('manifest', function(){
  gulp.src(['src/**/manifest.json'])
    .pipe(gulp.dest('dist/'))
});

gulp.task('options-styles', function(){
  var cssStream = gulp.src(['src/options/styles/**/*.css'])
    .pipe(concat('css-files.css'))

  var scssStream = gulp.src(['src/options/styles/**/*.scss'])
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(sass())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(rename({suffix: '.min'}))
    .pipe(concat('scss-files.scss'))

  var mergedStream = merge(cssStream, scssStream)
    .pipe(concat('style.css'))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/options/styles'));

  return mergedStream;
});

gulp.task('build', ['manifest', 'styles', 'scripts', 'options-html', 'options-styles']);

gulp.task('watch', function(){
  gulp.watch("src/**/mainfest.json", ['manifest']);
  gulp.watch("src/styles/**/*.scss", ['styles']);
  gulp.watch("src/scripts/**/*.js", ['scripts']);
  gulp.watch("src/options/**/*.html", ['options-html']);
  gulp.watch("src/options/styles/**/*.scss", ['options-styles']);
});

gulp.task('default', ['build', 'watch']);
