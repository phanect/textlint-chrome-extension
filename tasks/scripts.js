import gulp from 'gulp';
import gulpif from 'gulp-if';
import webpack from 'webpack';
import gulpWebpack from 'webpack-stream';
import sourcemaps from 'gulp-sourcemaps';
import espower from 'gulp-espower';
import livereload from 'gulp-livereload';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import args from './lib/args';
import _ from 'lodash';
import path from 'path';

const rootDir = path.join(__dirname, '..')
const scriptsDir = `${rootDir}/app/scripts`;

function getWebpackConfig(testing) {
  return {
    entry: testing ? null : {
      background: `${scriptsDir}/background.js`,
      contentscript: `${scriptsDir}/contentscript.js`,
      options: `${scriptsDir}/options.js`,
      popup: `${scriptsDir}/popup.js`,
      sandbox: `${scriptsDir}/sandbox.js`,

      vendor: ['jquery', 'lodash'],
      jquery: `${scriptsDir}/exporter/jquery.js`,
    },
    output: testing ? { filename: 'tests.js' } : {
      filename: '[name].js',
      publicPath: '/scripts/',
    },
    devtool: testing ?
      (args.watch ? '#inline-source-map' : null) :
      (args.sourcemaps ? 'inline-source-map' : null),
    watch: args.watch,
    plugins: [
      new webpack.IgnorePlugin(
        /package\.json$|\.md$|\.d\.ts$/
      ),
      new webpack.DefinePlugin({
        '__ENV__': JSON.stringify(args.production ? 'production' : 'development'),
        '__VENDOR__': JSON.stringify(args.vendor),
        'DEBUG': !args.production && !testing,
        'LIVERELOAD': args.watch && !testing,
        'process.env': {
          'NODE_ENV': JSON.stringify(args.production ? 'production' : 'development')
        }
      }),
    ].concat(!testing ? [
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: Infinity
      }),
    ] : []).concat(args.production ? [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.AggressiveMergingPlugin(),
      new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }),
    ] : []),
    module: {
      preLoaders: [
        {
          test: /node_modules\/kuromoji\/dist\/node\/TokenizerBuilder\.js/,
          loader: 'string-replace',
          query: {
            search: './loader/NodeDictionaryLoader.js',
            replace: `${scriptsDir}/shim/kuromoji/ChromeDictionaryLoader.js`
          }
        },
        {
          test: /node_modules\/kuromojin\/lib\/kuromojin\.js/,
          loader: 'string-replace',
          query: {
            search: 'require.resolve("kuromoji")',
            replace: '""'
          }
        },
        {
          test: /node_modules\/sorted-array\/sorted-array\.js/,
          loader: 'string-replace',
          query: {
            search: 'define(SortedArray);',
            replace: 'void(0);'
          }
        },
        {
          test: /node_modules\/prh\/lib\/index\.js/,
          loader: 'string-replace',
          query: {
            search: 'fs.readFileSync',
            replace: `require("${scriptsDir}/shim/prh/fs-mock").readFileSync`
          }
        }
      ],
      loaders: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel'
        },
        {
          test: /node_modules\/regx\/src\/regx\.js$/,
          loader: 'babel'
        },
        {
          test: /interop-require|try-resolve|require-like|textlint-formatter/,
          loader: 'null'
        },
        {
          test: /\.json$/,
          loader: 'json'
        }
      ]
    },
    node: {
      process: 'mock',
      fs: 'empty',
      module: 'empty'
    },
    resolve: {
      alias: _.extend({
        // Avoid "This seems to be a pre-built javascript file" warning.
        regx: `${rootDir}/node_modules/regx/src/regx.js`,
      }, testing ? {
        [`${scriptsDir}/lib/app/bundles`]: 'tmp/bundle/bundles.js'
      } : {})
    }
  };
}

gulp.task('scripts', ['bundle'], () => {
  return gulp.src(['app/scripts/*.js'])
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(gulpWebpack(getWebpackConfig(false)))
    .pipe(gulp.dest(`dist/${args.vendor}/scripts`))
    .pipe(gulpif(args.watch, livereload()));
});

gulp.task('scripts:test', ['bundle:test'], () => {
  return buildForTest();
});

export function buildForTest() {
  if (args.watch) {
    return gulp.src(['tests/entry.js'])
      .pipe(gulpWebpack(getWebpackConfig(true)))
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(espower())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('tmp/scripts'));
  } else {
    return gulp.src(['tests/entry.js'])
      .pipe(gulpWebpack(getWebpackConfig(true)))
      .pipe(gulp.dest('tmp/scripts'));
  }
}
