'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass'); // Sass plugin for Gulp
const plumber = require('gulp-plumber'); // Prevent pipe breaking caused by errors from gulp plugins
const postcss = require('gulp-postcss'); // PostCSS gulp plugin to pipe CSS through several plugins, but parse CSS only once.
const autoprefixer = require('autoprefixer'); // Parse CSS and add vendor prefixes to rules by Can I Use
const mqpacker = require('css-mqpacker'); // Pack same CSS media query rules into one using PostCSS
const minify = require('gulp-csso'); // Minify CSS with CSSO
const rename = require('gulp-rename'); // Rename files easily
const responsive = require('gulp-responsive'); // Resize and compress IMG's
const svgmin = require('gulp-svgmin'); // Minify SVG with SVGO
const server = require('browser-sync').create(); // Live CSS Reload & Browser Syncing
const run = require('run-sequence'); // Run a series of dependent gulp tasks in order
const compression = require('compression'); // Gzip
const uglify = require('gulp-uglify'); // Minify JS
const concat = require('gulp-concat'); // Concat
const sourcemaps = require('gulp-sourcemaps'); // SouceMaps for JS
const babel = require('gulp-babel'); // BabelJS

gulp.task('style', function() {
  gulp.src('src/sass/styles.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer({browsers: [
        'last 2 version',
        'last 3 Chrome versions',
        'last 3 Firefox versions',
        'last 3 Opera versions',
        'last 3 Edge versions']}),
      mqpacker({
        sort: true
      })
    ]))
    .pipe(gulp.dest('build/css'))
    .pipe(minify())
    .pipe(rename('styles.min.css'))
    .pipe(gulp.dest('build/css'))
    .pipe(server.stream());
});

gulp.task('js', function() {
  return gulp.src(['src/js/*.js', '!src/js/restaurant_info.js'])
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(concat('index.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/js'))
    .pipe(server.stream());
});

gulp.task('js_rest', function() {
  return gulp.src(['src/js/*.js', '!src/js/main.js'])
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(concat('rest.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/js'))
    .pipe(server.stream());
});

gulp.task('sw', function() {
  return gulp.src(['src/sw.js'])
    .pipe(gulp.dest('build'))
    .pipe(server.stream());
});

gulp.task('utility', function() {
  return gulp.src([
    'src/*.html',
    'src/manifest.json',
    'src/icons/*.png',
    'src/img/map/*.jpg'
  ], {base: 'src'})
    .pipe(gulp.dest('build'))
    .pipe(server.stream());
});

gulp.task('serve', function() {
  server.init({
    server: 'build',
    middleware: [compression()],
    //httpModule: 'http2',
    //https: true,
    notify: false,
    open: true,
    ui: false
  });

  gulp.watch('src/sw.js', ['sw']);
  gulp.watch('src/js/*.js', ['js', 'js_rest']);
  gulp.watch('src/*.html', ['copy_html']);
  gulp.watch('build/*.html').on('change', server.reload);
  gulp.watch('src/sass/**/*.{scss,sass}', ['style']);
});

gulp.task('copy_html', function() {
  return gulp.src('src/*.html', {base: 'src'})
    .pipe(gulp.dest('build'));
});

gulp.task('imgmin', function() {
  return gulp.src('src/img/*.jpg')
    .pipe(responsive({
      '*.jpg': {
        quality: 70
      }
    }))
    .pipe(gulp.dest('build/img'))
    .pipe(responsive({
      '*.jpg': {
        width: 400,
        height: 400,
        min: true
      }
    }))
    .pipe(rename(function (path) {
      path.basename += '-400';
    }))
    .pipe(gulp.dest('build/img'));
});

gulp.task('pngmin', function() {
  return gulp.src('src/img/**/*.png')
    .pipe(responsive({
      '*.png': {
        compressionLevel: 5
      }
    }))
    .pipe(gulp.dest('build/img'))
});

gulp.task('build', function(fn) {
  run('imgmin', 'js', 'js_rest', 'sw', 'utility', 'style', fn);
});
