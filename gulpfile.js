var gulp = require('gulp');
var gutil = require('gulp-util');

var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var clean = require('gulp-clean');
var sass = require('gulp-sass');
var csscomb = require('gulp-csscomb');
var cssbeautify = require('gulp-cssbeautify');
var autoprefixer = require('gulp-autoprefixer');
var csso = require('gulp-csso');
var rename = require('gulp-rename');
var imagemin = require('gulp-imagemin');
var browserSync = require('browser-sync');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var filesize = require('gulp-filesize');
var critical = require('critical');

var bases = {
  app: 'app/',
  dist: 'dist/',
};

var paths = {
  scripts: ['scripts/**/*.js'],
  styles: ['styles/*.css'],
  html: ['*.html'],
  images: ['images/**/*.*'],
  fonts: ['fonts/*.*'],
  others: ['.htaccess', 'robots.txt']
};

gulp.task('clean', function() {
  return gulp.src(bases.dist)
    .pipe(clean());
});

gulp.task('copy', ['clean'], function() {

  gulp.src(paths.html, { cwd: bases.app })
    .pipe(gulp.dest(bases.dist));

  gulp.src(paths.fonts, { cwd: bases.app })
    .pipe(gulp.dest(bases.dist + 'fonts/'));

  gulp.src(paths.others, { cwd: bases.app })
    .pipe(gulp.dest(bases.dist));
});

gulp.task('css', function() {
  return gulp.src(paths.styles, { cwd: bases.app })
    .pipe(csscomb())
    .pipe(cssbeautify({ indent: '  ' }))
    .pipe(autoprefixer())
    .pipe(gulp.dest(bases.dist + 'styles/'))
    .pipe(csso())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(bases.dist + 'styles/'));
});

gulp.task('sass', function() {
  return gulp.src(paths.styles)
    .pipe(sass().on('error', sass.logError))
    .pipe(csscomb())
    .pipe(cssbeautify({ indent: '  ' }))
    .pipe(autoprefixer())
    .pipe(gulp.dest(paths.styles))
    .pipe(browserSync.reload({
      stream: true
    }));
})

gulp.task('js', function() {
  return gulp.src(paths.scripts, { cwd: bases.app })
    .pipe(concat('main.js'))
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(gulp.dest(bases.dist + 'scripts/'))
    .pipe(filesize())
    .pipe(uglify())
    .pipe(rename('main.min.js'))
    .pipe(gulp.dest(bases.dist + 'scripts/'))
    .pipe(filesize())
    .on('error', gutil.log);
});

gulp.task('img', function() {
  return gulp.src(paths.images, { cwd: bases.app })
    .pipe(imagemin())
    .pipe(gulp.dest(bases.dist + 'images/'));
});

gulp.task('critical', function() {
  critical.generate({
    base: bases.dist,
    src: 'index.html',
    inline: true,
    css: [bases.dist + 'styles/main.min.css', bases.dist + 'styles/bootstrap.min.css'],
    dimensions: [{
      width: 320,
      height: 480
    }, {
      width: 768,
      height: 1024
    }, {
      width: 1280,
      height: 960
    }],
    dest: 'index-critical.html',
    minify: true,
    extract: false,
    ignore: ['font-face'],
  })
});

gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: bases.app
    },
  })
});

// Production task
gulp.task('prod', ['copy', 'js', 'css', 'img', 'critical']);

// Watch over file changes
gulp.task('watch', ['browserSync'], function() {
  gulp.watch(paths.styles, ['sass']);
  gulp.watch(paths.html, browserSync.reload);
  gulp.watch(paths.scripts, browserSync.reload);
});
