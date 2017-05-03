var gulp = require('gulp');
var gutil = require('gulp-util');
var gulpif = require('gulp-if');
var clean = require('gulp-clean');
var watch = require('gulp-watch');
var useref = require('gulp-useref');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var runSequence = require('run-sequence');

var bases = {
    app: 'app/',
    dist: 'dist/'
};

var paths = {
    css: './css/**/*.css',
    fonts: './fonts/**/*.*',
    html: './index.html',
    images: './images/**/*.*',
    others: ['browserconfig.xml', 'manifest.json', '.htaccess', 'google46e54d9618da9e3c.html', 'robots.txt'],
    scripts: './js/**/*.js',
    scss: './styles/scss/**/*.scss'
};

gulp.task('jshint', function() {
    gulp.src(paths.scripts, { cwd: bases.app })
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('sass', function() {
    return gulp.src(paths.scss, { cwd: bases.app })
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(bases.app + '/styles/css/'));
});

gulp.task('scripts', function() {
    return gulp.src(paths.scripts, { cwd: bases.dist })
        .pipe(uglify())
        .pipe(gulp.dest('js/', { cwd: bases.dist }));
});

gulp.task('styles', function() {
    return gulp.src(paths.css, { cwd: bases.dist })
        .pipe(autoprefixer())
        .pipe(cleanCSS())
        .pipe(gulp.dest('css/', { cwd: bases.dist }));
});

// Copy tasks
gulp.task('fonts', function() {
    return gulp.src(paths.fonts, { cwd: bases.app })
        .pipe(gulp.dest(bases.dist + '/fonts'));
});

gulp.task('html', function() {
    return gulp.src(paths.html, { cwd: bases.app })
        .pipe(useref())
        .pipe(gulp.dest(bases.dist));
});

gulp.task('images', function() {
    return gulp.src(paths.images, { cwd: bases.app })
        .pipe(imagemin())
        .pipe(gulp.dest(bases.dist + '/images'));
});

gulp.task('others', function() {
    return gulp.src(paths.others, { cwd: bases.app })
        .pipe(gulp.dest(bases.dist));
});

// Clean task
gulp.task('clean:dist', function() {
    return gulp.src(bases.dist, { read: false })
        .pipe(clean());
});

// Build task
gulp.task('build', function(cb) {
    runSequence('clean:dist', ['sass', 'jshint'], ['html', 'fonts', 'others', 'images'], ['styles', 'scripts'], 'serve:dist', cb);
});


// Serve tasks
gulp.task('serve', function() {
    browserSync.init({
        server: 'app/',
        port: 8080
    });

    gulp.watch(bases.app + paths.html).on('change', browserSync.reload);
    gulp.watch(bases.app + paths.scss, ['sass']).on('change', browserSync.reload);
    gulp.watch(bases.app + paths.scripts).on('change', browserSync.reload);
});

gulp.task('serve:dist', function() {
    browserSync.init({
        server: 'dist/',
        port: 8080
    });
});