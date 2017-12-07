const gulp = require('gulp');
const gutil = require('gulp-util');
const pug = require('gulp-pug');
const browserSync = require('browser-sync').create();
const del = require('del');
const _ = require('lodash');

////////////////////////////////////////////////////////////////////////////////
// Build tasks

gulp.task('html', () => {
  const p = pug({
    verbose: true,
  });

  return gulp
    .src('html/*.pug')
    .pipe(
      p.on('error', err => {
        gutil.log(err.stack);
        p.end();
      }),
    )
    .pipe(gulp.dest('public'));
});

gulp.task('images', () => {
  return gulp.src('images/**/*').pipe(gulp.dest('public'));
});

gulp.task('styles', () => {
  return gulp.src('styles/**/*').pipe(gulp.dest('public'));
});

gulp.task('all', ['html', 'images', 'styles']);

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
        baseDir: './public',
      },
      open: false,
    },
    done,
  );

  gulp.watch('public/**/*').on(
    'change',
    _.throttle(browserSync.reload, 1000, {
      trailing: false,
    }),
  );
});

////////////////////////////////////////////////////////////////////////////////
// Kick it off

gulp.task('default', ['clean', 'all', 'browser-sync']);
gulp.watch('html/**/*', ['html']);
gulp.watch('images/**/*', ['images']);
gulp.watch('styles/**/*', ['styles']);
