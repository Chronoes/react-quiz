require('babel-core/register')({
  optional: ['es7'],
});
import gulp from 'gulp';
import eslint from 'gulp-eslint';
import sasslint from 'gulp-sass-lint';
import sloc from 'gulp-sloc';
import cache from 'gulp-cached';
import remember from 'gulp-remember';
import minifyHtml from 'gulp-htmlmin';

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
  distribution: './static',
};

gulp.task('notify', () => {
  notifier.notify({
    title: 'Gulp',
    message: 'build finished',
    icon: 'atom',
  });
});

gulp.task('line-count', () => {
  return gulp.src(
    [
      directories.root,
      directories.source.scripts,
    ])
    .pipe(remember('scripts'))
    .pipe(sloc());
});

gulp.task('lint:sass', () => {
  return gulp.src(directories.source.styles)
    .pipe(remember('styles'))
    .pipe(sasslint())
    .pipe(sasslint.format())
    .pipe(sasslint.failOnError());
});

gulp.task('lint:scripts', () => {
  return gulp.src(directories.source.scripts)
    .pipe(remember('scripts'))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('lint', ['lint:scripts', 'lint:sass']);

gulp.task('html', () => {
  return gulp.src(directories.source.index)
    .pipe(cache('html'))
    .pipe(gulp.dest(directories.distribution));
});

gulp.task('html:production', () => {
  return gulp.src(directories.source.index)
    .pipe(minifyHtml({collapseWhitespace: true}))
    .pipe(gulp.dest(directories.distribution));
});

gulp.task('images', () => {
  return gulp.src(directories.source.images)
    .pipe(cache('images'))
    .pipe(gulp.dest(directories.distribution));
});

gulp.task('webpack', done => {
  return webpack(webpackConfigDev).run(() => done());
});

gulp.task('webpack:production', done => {
  return webpack(webpackConfigProd).run(() => done());
});

gulp.task('build', done => {
  runSequence(['line-count', 'lint'], ['webpack', 'html', 'images'], 'notify', done);
});

gulp.task('build:watch', done => {
  runSequence(['line-count', 'lint'], ['html', 'images'], done);
});

gulp.task('build:production', done => {
  runSequence(['line-count', 'lint'], ['webpack:production', 'html:production', 'images'], 'notify', done);
});

gulp.task('server', () => {
  const server = spawn('node', ['devServer']);
  server.stdout.on('data', data => process.stdout.write(`webpack-server: ${data}`));
  server.stderr.on('data', data => process.stderr.write(`webpack-server: ${data}`));
});

gulp.task('watch', () => {
  return gulp.watch(
    [
      directories.source.styles,
      directories.source.images,
      directories.source.index,
    ], ['build:watch']);
});

gulp.task('default', ['build:watch', 'server', 'watch']);
