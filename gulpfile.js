const gulp = require('gulp');
const gutil = require('gulp-util');
const pug = require('gulp-pug');
const run = require('gulp-run');
const rollup = require('rollup-stream');
const buble = require('rollup-plugin-buble');
const rename = require('gulp-rename');
const source = require('vinyl-source-stream');
const browserSync = require('browser-sync').create();
const del = require('del');
const _ = require('lodash');
const postcss = require('gulp-postcss');
const cssnext = require('postcss-cssnext');
const cssnano = require('cssnano');
const easyImport = require('postcss-easy-import');

////////////////////////////////////////////////////////////////////////////////
// Build tasks

gulp.task('html', () => {
  const p = pug({
    verbose: true
  });

  return gulp
    .src('html/*.pug')
    .pipe(
      p.on('error', err => {
        gutil.log(err.stack);
        p.end();
      })
    )
    .pipe(gulp.dest('public'));
});

gulp.task('images', () => {
  return gulp.src('images/in-use/**/*').pipe(gulp.dest('public'));
});

gulp.task('favicon', () => {
  // Unzip folder generated from https://www.favicon-generator.org/
  return gulp.src('favicon/**/*').pipe(gulp.dest('public'));
});

gulp.task('css', () => {
  const p = postcss([
    easyImport,
    cssnext({
      features: {
        autoprefixer: {
          grid: true
        }
      }
    }),
    cssnano()
  ]);

  return gulp
    .src('css/index.css')
    .pipe(
      p.on('error', err => {
        gutil.log(err.stack);
        p.end();
      })
    )
    .pipe(gulp.dest('public'));
});

gulp.task('js', () => {
  return rollup({
    input: './js/index.js',
    format: 'es',
    plugins: [
      buble({
        transforms: {
          dangerousForOf: true
        }
      })
    ]
  })
    .on('error', function(e) {
      console.error(e.stack);
      this.emit('end');
    })
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('public'));
});

gulp.task('logo', () => {
  return run('node scripts/generateLogo.js', { silent: true })
    .exec()
    .pipe(rename('logo.svg'))
    .pipe(gulp.dest('public'));
});

gulp.task('all', ['logo', 'html', 'images', 'favicon', 'css', 'js']);

////////////////////////////////////////////////////////////////////////////////
// Helpers

gulp.task('clean', done => {
  del.sync('public');
  done();
});

gulp.task('browser-sync', ['clean', 'all'], done => {
  browserSync.init(
    {
      server: {
        baseDir: './public'
      },
      open: false
    },
    done
  );

  gulp.watch('public/**/*').on(
    'change',
    _.throttle(browserSync.reload, 1000, {
      trailing: false
    })
  );
});

////////////////////////////////////////////////////////////////////////////////
// Kick it off

gulp.task('default', ['clean', 'all', 'browser-sync'], () => {
  gulp.watch('scripts/generateLogo.js', ['logo']);
  gulp.watch('html/**/*', ['html']);
  gulp.watch('images/**/*', ['images']);
  gulp.watch('favicon/**/*', ['favicon']);
  gulp.watch('css/**/*', ['css']);
  gulp.watch('js/**/*', ['js']);
});
