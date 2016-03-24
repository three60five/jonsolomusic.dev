//Include gulp
var gulp = require('gulp');

//Include plugins
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var minifyCSS = require('gulp-clean-css');
var browserSync = require('browser-sync');
var runSequence = require('run-sequence');
var prefix = require('gulp-autoprefixer');

// Start browserSync server
gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: 'app'
    }
  })
})

gulp.task('sass-watch',  function() {
  browserSync.reload();
});

// Compile SASS and reload browser
gulp.task('sass-compile', function(cb) {
  return gulp.src('app/sass/**/*.scss') // Gets all files ending with .scss in app/sass and children dirs
    .pipe(sass()) // Passes it through a gulp-sass
    .pipe(prefix({ cascade: true })) //autoprefix
    .pipe(rename('styles.css')) //rename file
    .pipe(gulp.dest('app/css')) // Outputs it in the css folder
    .pipe(minifyCSS()) // minify css
    .pipe(rename('styles.min.css'))
    .pipe(gulp.dest('app/css'))
    .pipe(gulp.dest('dist/css')) // Outputs it in the css folder
    .pipe(browserSync.stream())
    cb(err);
})

gulp.task('sass', ['sass-compile', 'sass-watch']);

gulp.task('flickity-js', function() {
  return gulp.src('node_modules/flickity/dist/flickity.pkgd.min.js')
    .pipe(gulp.dest('app/js')) // Outputs it in the css folder
    .pipe(gulp.dest('dist/js')) // Outputs it in the css folder
})

gulp.task('flickity-css', function() {
  return gulp.src('node_modules/flickity/dist/flickity.min.css')
    .pipe(gulp.dest('app/css')) // Outputs it in the css folder
    .pipe(gulp.dest('dist/css')) // Outputs it in the css folder
})

// Watchers
gulp.task('watch', function() {
  gulp.watch('app/sass/**/*.scss', ['sass']);
  gulp.watch('app/*.html', browserSync.reload); 
  gulp.watch('app/js/**/*.js', browserSync.reload); 
  gulp.watch('app/css/*.css', ['sass-watch']);
})


gulp.task('default', function(callback) {
  runSequence(['sass', 'browserSync', 'watch'],
    callback
  )
})