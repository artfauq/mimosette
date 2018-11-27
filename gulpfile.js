const gulp = require('gulp');
const gutil = require('gulp-util');
const clean = require('gulp-clean');
const cleanCSS = require('gulp-clean-css');
const critical = require('critical').stream;
const purge = require('gulp-css-purge');
const useref = require('gulp-useref');
const eslint = require('gulp-eslint');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const autoprefixer = require('gulp-autoprefixer');
const runSequence = require('run-sequence');

const bases = {
  app: './src/',
  dist: './dist/'
};

const paths = {
  css: './css/**/*.css',
  fonts: './fonts/**/*.*',
  html: './*.html',
  images: './images/**/*.*',
  others: ['*.xml', '*.json', '.htaccess', '*.txt'],
  scripts: './js/**/*.js',
  scss: './styles/scss/**/*.scss'
};

gulp.task('eslint', () => {
  gulp
    .src(paths.scripts, {
      cwd: bases.dist
    })
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('sass', () =>
  gulp
    .src(paths.scss, {
      cwd: bases.app
    })
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(`${bases.app}/styles/css/`))
);

gulp.task('scripts', () =>
  gulp
    .src(paths.scripts, {
      cwd: bases.dist
    })
    .pipe(uglify())
    .on('error', err => {
      gutil.log(gutil.colors.red('[Error]'), err.toString());
    })
    .pipe(
      gulp.dest('js/', {
        cwd: bases.dist
      })
    )
);

gulp.task('styles', () =>
  gulp
    .src(paths.css, {
      cwd: bases.dist
    })
    .pipe(autoprefixer())
    .pipe(purge())
    .pipe(cleanCSS())
    .pipe(
      gulp.dest('css/', {
        cwd: bases.dist
      })
    )
);

gulp.task('critical', () =>
  gulp
    .src('index.html', {
      cwd: bases.dist
    })
    .pipe(
      critical({
        base: bases.dist,
        inline: true,
        minify: true,
        css: [`${bases.dist}./css/main.min.css`]
      })
    )
    .on('error', err => {
      gutil.log(gutil.colors.red(err.message));
    })
    .pipe(gulp.dest(bases.dist))
);

// Copy tasks
gulp.task('fonts', () =>
  gulp
    .src(paths.fonts, {
      cwd: bases.app
    })
    .pipe(gulp.dest(`${bases.dist}/fonts`))
);

gulp.task('html', () =>
  gulp
    .src(paths.html, {
      cwd: bases.app
    })
    .pipe(useref())
    .pipe(gulp.dest(bases.dist))
);

gulp.task('images', () =>
  gulp
    .src(paths.images, {
      cwd: bases.app
    })
    .pipe(imagemin())
    .pipe(gulp.dest(`${bases.dist}/images`))
);

gulp.task('others', () =>
  gulp
    .src(paths.others, {
      cwd: bases.app
    })
    .pipe(gulp.dest(bases.dist))
);

// Clean task
gulp.task('clean:dist', () =>
  gulp
    .src(bases.dist, {
      read: false
    })
    .pipe(clean())
);

// Build task
gulp.task('build', cb => {
  runSequence(
    'clean:dist',
    ['sass', 'eslint'],
    ['html', 'fonts', 'others', 'images'],
    ['styles', 'scripts'],
    // 'critical',
    'serve:dist',
    cb
  );
});

// Serve tasks
gulp.task('serve', ['sass', 'eslint'], () => {
  browserSync.init({
    server: {
      baseDir: ['./', bases.app]
    }
  });

  gulp.watch(bases.app + paths.html).on('change', browserSync.reload);
  gulp.watch(bases.app + paths.scss, ['sass']).on('change', browserSync.reload);
  gulp.watch(bases.app + paths.scripts, ['eslint']).on('change', browserSync.reload);
});

gulp.task('serve:dist', () => {
  browserSync.init({
    server: {
      baseDir: bases.dist
    }
  });
});
