import gulp from 'gulp';
import gutil from 'gulp-util';
import eslint from 'gulp-eslint';
import sasslint from 'gulp-sass-lint';
import sloc from 'gulp-sloc';
import cache from 'gulp-cached';
import remember from 'gulp-remember';
import minifyHtml from 'gulp-htmlmin';
import jest from 'gulp-jest-cli';
import env from 'gulp-env';
import babel from 'gulp-babel';
import sourcemaps from 'gulp-sourcemaps';

import { spawn } from 'child_process';
import runSequence from 'run-sequence';
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
  distribution: {
    base: './dist',
    server: './dist/server',
    static: './dist/static',
  },
};

gulp.task('env-production', () => {
  env({
    vars: {
      NODE_ENV: 'production',
    },
  });
});

gulp.task('env-testing', () => {
  env({
    vars: {
      NODE_ENV: 'test',
    },
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
  .pipe(gulp.dest(directories.distribution.static))
);

gulp.task('html:production', () =>
  gulp.src(directories.source.index)
  .pipe(minifyHtml({ collapseWhitespace: true }))
  .pipe(gulp.dest(directories.distribution.static))
);

gulp.task('images', () =>
  gulp.src(directories.source.images)
  .pipe(cache('images'))
  .pipe(gulp.dest(directories.distribution.static))
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

let server;

gulp.task('server:close', (done) => {
  if (server) {
    server.on('close', done);
    server.kill('SIGINT');
  } else {
    done();
  }
});

gulp.task('server', ['server:close'], () => {
  server = spawn('node', [path.join(directories.distribution.base, 'devServer')]);
  const onData = (data) => gutil.log(data.toString().replace(/\n+$/, ''));
  server.stdout.on('data', onData);
  server.stderr.on('data', onData);
});

gulp.task('server:build', () =>
  gulp.src([
    `${directories.source.base}/*.js`,
    directories.source.server,
  ], { base: directories.source.base })
  .pipe(remember('server'))
  .pipe(sourcemaps.init())
  .pipe(babel())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(directories.distribution.base))
);

gulp.task('test', ['env-testing'], () =>
  gulp.src(directories.source.base)
  .pipe(jest())
);

gulp.task('build', (done) =>
  runSequence(['line-count', 'lint'], 'test', ['conf', 'server:build', 'webpack', 'html', 'images'], done)
);

gulp.task('build:watch', (done) =>
  runSequence(['conf', 'server:build', 'html', 'images'], 'server', done)
);

gulp.task('build:production', (done) =>
  runSequence(['line-count', 'lint'], 'test',
    ['conf', 'server:build', 'webpack:production', 'html:production', 'images'], done)
);


gulp.task('watch', () =>
  gulp.watch(
    [
      directories.source.server,
    ], ['build:watch'])
);

gulp.task('default', ['build:watch', 'watch']);
