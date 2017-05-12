var gulp = require('gulp'),
    gutil = require('gulp-util'),
    gulpif = require('gulp-if'),
    clean = require('gulp-clean'),
    cleanCSS = require('gulp-clean-css'),
    critical = require('critical').stream,
    purge = require('gulp-css-purge'),
    watch = require('gulp-watch'),
    useref = require('gulp-useref'),
    browserSync = require('browser-sync').create(),
    sass = require('gulp-sass'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    autoprefixer = require('gulp-autoprefixer'),
    runSequence = require('run-sequence');

var bases = {
    app: './app/',
    dist: './dist/'
};

var paths = {
    css: './css/**/*.css',
    fonts: './fonts/**/*.*',
    html: './index.html',
    images: './images/**/*.*',
    others: ['browserconfig.xml', 'manifest.json', '.htaccess', 'google46e54d9618da9e3c.html', '*.txt'],
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
        .pipe(purge())
        .pipe(cleanCSS())
        .pipe(gulp.dest('css/', { cwd: bases.dist }));
});

gulp.task('critical', function() {
    return gulp.src('index.html', { cwd: bases.dist })
        .pipe(critical({
            base: bases.dist,
            inline: true,
            minify: true,
            css: [bases.dist + './css/main.min.css']
        }))
        .on('error', function(err) {
            gutil.log(gutil.colors.red(err.message));
        })
        .pipe(gulp.dest(bases.dist));
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
    runSequence('clean:dist', ['sass', 'jshint'], ['html', 'fonts', 'others', 'images'], ['styles', 'scripts'], 'critical', 'serve:dist', cb);
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