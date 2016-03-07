import gulp from 'gulp';
import gulpif from 'gulp-if';
import named from 'vinyl-named';
import webpack from 'webpack';
import gulpWebpack from 'webpack-stream';
import livereload from 'gulp-livereload';
import args from './lib/args';
import path from 'path';

const appDir = path.join(__dirname, '../app');
const scriptsDir = `${appDir}/scripts`;

gulp.task('scripts', (cb) => {
  return gulp.src(['app/scripts/*.js'])
    .pipe(gulpWebpack({
      entry: {
        background: `${scriptsDir}/background.js`,
        contentscript: `${scriptsDir}/contentscript.js`,
        options: `${scriptsDir}/options.js`,
        popup: `${scriptsDir}/popup.js`,

        vendor: ['jquery', 'lodash'],
        jquery: `${scriptsDir}/exporter/jquery.js`,
      },
      output: {
        filename: '[name].js',
        publicPath: '/scripts/',
      },
      devtool: args.sourcemaps ? 'source-map': null,
      watch: args.watch,
      plugins: [
        new webpack.DefinePlugin({
          '__ENV__': JSON.stringify(args.production ? 'production' : 'development'),
          '__VENDOR__': JSON.stringify(args.vendor)
        }),
        new webpack.IgnorePlugin(
          /package\.json$|\.md$|\.d\.ts$/
        ),
        new webpack.optimize.CommonsChunkPlugin({
          name: 'vendor',
          minChunks: Infinity
        }),
      ].concat(args.production ? [
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.DedupePlugin(),
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
          }
        ],
        loaders: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
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
      }
    }))
    .pipe(gulp.dest(`dist/${args.vendor}/scripts`))
    .pipe(gulpif(args.watch, livereload()));
});

