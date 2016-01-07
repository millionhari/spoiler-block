var gulp = require('gulp'),
    plumber = require('gulp-plumber');
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
    .pipe(concat('app.js'))
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
    .pipe(concat('scss-files.scss'))

  var mergedStream = merge(cssStream, scssStream)
    .pipe(concat('style.css'))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/options/styles'));

  return mergedStream;
});

gulp.task('options-scripts', function(){
  return gulp.src('src/options/scripts/**/*.js')
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(concat('options.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/options/scripts/'))
});

gulp.task('background', function(){
  return gulp.src('src/backgroundpage/**/*.js')
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(concat('background.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/backgroundpage/'))
});

gulp.task('build', ['manifest', 'images', 'background', 'styles', 'scripts', 'options-html', 'options-styles', 'options-scripts']);

gulp.task('watch', function(){
  gulp.watch("src/**/manifest.json", ['manifest']);
  gulp.watch("src/backgroundpage/**/*.js", ['background']);
  gulp.watch("src/styles/**/*.scss", ['styles']);
  gulp.watch("src/scripts/**/*.js", ['scripts']);
  gulp.watch("src/options/**/*.html", ['options-html']);
  gulp.watch("src/options/styles/**/*.scss", ['options-styles']);
  gulp.watch("src/options/scripts/**/*.js", ['options-scripts']);
});

gulp.task('default', ['build', 'watch']);
