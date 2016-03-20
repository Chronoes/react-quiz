require('babel-core/register');
import gulp from 'gulp';
import eslint from 'gulp-eslint';
import sasslint from 'gulp-sass-lint';
import sloc from 'gulp-sloc';
import cache from 'gulp-cached';
import remember from 'gulp-remember';
import minifyHtml from 'gulp-htmlmin';
import mocha from 'gulp-mocha';
import env from 'gulp-env';

import {spawn} from 'child_process';
import runSequence from 'run-sequence';
import notifier from 'node-notifier';

import webpack from 'webpack';
import webpackConfigDev from './webpack.config.dev';
import webpackConfigProd from './webpack.config.prod';

const directories = {
  root: './*.js',
  source: {
    base: './src',
    index: './src/index.html',
    scripts: './src/scripts/**/*.jsx',
    main: './src/scripts/main.jsx',
    styles: './src/styles/**/*.scss',
    images: './src/images/**/*',
  },
  test: './test/*.js',
  server: './server/**/*.js',
  distribution: './static',
};

gulp.task('env-testing', () => {
  env({
    vars: {
      NODE_ENV: 'testing',
    },
  });
});

gulp.task('notify', () => {
  notifier.notify({
    title: 'Gulp',
    message: 'build finished',
    icon: 'atom',
  });
});

gulp.task('line-count', () =>
  gulp.src(
    [
      directories.root,
      directories.source.scripts,
    ])
  .pipe(remember('scripts'))
  .pipe(sloc())
);

gulp.task('lint:sass', () =>
  gulp.src(directories.source.styles)
  .pipe(remember('styles'))
  .pipe(sasslint())
  .pipe(sasslint.format())
  .pipe(sasslint.failOnError())
);

gulp.task('lint:scripts', () =>
  gulp.src(directories.source.scripts)
  .pipe(remember('scripts'))
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError())
);

gulp.task('lint', ['lint:scripts', 'lint:sass']);

gulp.task('html', () =>
  gulp.src(directories.source.index)
  .pipe(cache('html'))
  .pipe(gulp.dest(directories.distribution))
);

gulp.task('html:production', () =>
  gulp.src(directories.source.index)
  .pipe(minifyHtml({collapseWhitespace: true}))
  .pipe(gulp.dest(directories.distribution))
);

gulp.task('images', () =>
  gulp.src(directories.source.images)
  .pipe(cache('images'))
  .pipe(gulp.dest(directories.distribution))
);

gulp.task('test', ['env-testing'], () => {
  // Patch for extensible destructuring
  require('extensible-polyfill').patch('safe');

  return gulp.src(directories.test, {read: false})
  .pipe(remember('test'))
  .pipe(mocha({reporter: 'spec', timeout: 10000, globals: '__extensible_get__'}));
});


gulp.task('webpack', (done) =>
  webpack(webpackConfigDev).run(() => done())
);

gulp.task('webpack:production', (done) =>
  webpack(webpackConfigProd).run(() => done())
);

gulp.task('build', (done) =>
  runSequence(['line-count', 'lint'], ['webpack', 'html', 'images'], 'notify', done)
);

gulp.task('build:watch', (done) =>
  runSequence(['line-count', 'lint'], ['html', 'images'], done)
);

gulp.task('build:production', (done) =>
  runSequence(['line-count', 'lint'], ['webpack:production', 'html:production', 'images'], 'notify', done)
);

gulp.task('server', () => {
  const server = spawn('node', ['devServer']);
  server.stdout.on('data', data => process.stdout.write(`webpack-server: ${data}`));
  server.stderr.on('data', data => process.stderr.write(`webpack-server: ${data}`));
});

gulp.task('watch', () =>
  gulp.watch(
    [
      directories.source.images,
      directories.source.index,
    ], ['build:watch'])
);

gulp.task('default', ['build:watch', 'server', 'watch']);
