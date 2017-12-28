const gulp = require('gulp');
const gutil = require('gulp-util');
const pug = require('gulp-pug');
const run = require('gulp-run');
const rename = require('gulp-rename');
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

gulp.task('logo', () => {
  return run('node scripts/generateLogo.js', { silent: true })
    .exec()
    .pipe(rename('logo.svg'))
    .pipe(gulp.dest('public'));
});

gulp.task('all', ['logo', 'html', 'images', 'favicon', 'css']);

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
});
