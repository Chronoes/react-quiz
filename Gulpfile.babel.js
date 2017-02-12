import 'babel-core/register';
import gulp from 'gulp';
import eslint from 'gulp-eslint';
import sasslint from 'gulp-sass-lint';
import sloc from 'gulp-sloc';
import cache from 'gulp-cached';
import remember from 'gulp-remember';
import minifyHtml from 'gulp-htmlmin';
import mocha from 'gulp-mocha';
import env from 'gulp-env';
import babel from 'gulp-babel';

import { spawn } from 'child_process';
import runSequence from 'run-sequence';
import notifier from 'node-notifier';
import path from 'path';

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
    server: './src/server/**/*.js',
  },
  test: './test/*.js',
  distribution: {
    base: './dist',
    server: './dist/server',
    static: './dist/static',
  },
};

gulp.task('env-testing', () => {
  env({
    vars: {
      NODE_ENV: 'testing',
    },
  });
});

gulp.task('env-production', () => {
  env({
    vars: {
      NODE_ENV: 'production',
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
      directories.test,
    ])
  .pipe(remember('scripts'))
  .pipe(sloc({ tolerant: true }))
);

gulp.task('lint:sass', () =>
  gulp.src(directories.source.styles)
  .pipe(remember('styles'))
  .pipe(sasslint())
  .pipe(sasslint.format())
);

gulp.task('lint:js', () =>
  gulp.src([
    directories.root,
    directories.source.scripts,
    directories.source.server,
  ])
  .pipe(remember('js'))
  .pipe(eslint())
  .pipe(eslint.format())
);

gulp.task('lint', ['lint:js', 'lint:sass']);

gulp.task('html', () =>
  gulp.src(directories.source.index)
  .pipe(cache('html'))
  .pipe(gulp.dest(directories.static))
);

gulp.task('html:production', () =>
  gulp.src(directories.source.index)
  .pipe(minifyHtml({ collapseWhitespace: true }))
  .pipe(gulp.dest(directories.static))
);

gulp.task('images', () =>
  gulp.src(directories.source.images)
  .pipe(cache('images'))
  .pipe(gulp.dest(directories.static))
);

gulp.task('test', ['env-testing'], () =>
  gulp.src(directories.test, { read: false })
  .pipe(remember('test'))
  .pipe(mocha({ reporter: 'spec', timeout: 10000 }))
);


gulp.task('webpack', (done) =>
  webpack(webpackConfigDev).run(() => done())
);

gulp.task('webpack:production', ['env-production'], (done) =>
  webpack(webpackConfigProd).run(() => done())
);

gulp.task('conf', () =>
  gulp.src(directories.root)
  .pipe(babel())
  .pipe(gulp.dest(directories.distribution.base))
);

gulp.task('server', () => {
  const server = spawn('node', [path.join(directories.distribution.base, 'devServer')]);
  server.stdout.on('data', data => process.stdout.write(`webpack-server: ${data}`));
  server.stderr.on('data', data => process.stderr.write(`webpack-server: ${data}`));
});

gulp.task('server:build', () =>
  gulp.src([
    `${directories.source.base}/*.js`,
    directories.source.server,
  ], { base: directories.source.base })
  .pipe(remember('server'))
  .pipe(babel())
  .pipe(gulp.dest(directories.distribution.base))
);

gulp.task('build', (done) =>
  runSequence(['line-count', 'lint'], 'test', ['conf', 'server:build', 'webpack', 'html', 'images'], 'notify', done)
);

gulp.task('build:watch', (done) =>
  runSequence('lint', /* 'test',*/ ['conf', 'server:build', 'html', 'images'], done)
);

gulp.task('build:production', (done) =>
  runSequence(['line-count', 'lint'], 'test',
    ['conf', 'server:build', 'webpack:production', 'html:production', 'images'], 'notify', done)
);


gulp.task('watch', () =>
  gulp.watch(
    [
      directories.source.images,
      directories.source.index,
      directories.source.server,
      directories.test,
    ], ['build:watch'])
);

gulp.task('default', ['build:watch', 'server', 'watch']);
