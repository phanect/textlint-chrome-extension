import gulp from 'gulp';
import gulpif from 'gulp-if';
import named from 'vinyl-named';
import webpack from 'webpack';
import gulpWebpack from 'webpack-stream';
import livereload from 'gulp-livereload';
import args from './lib/args';
import path from 'path';

gulp.task('scripts', (cb) => {
  return gulp.src('app/scripts/*.js')
    .pipe(named())
    .pipe(gulpWebpack({
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
              replace: path.join(__dirname, '../app/scripts/shim/kuromoji/ChromeDictionaryLoader.js')
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
        fs: 'empty',
        module: 'empty'
      }
    }))
    .pipe(gulp.dest(`dist/${args.vendor}/scripts`))
    .pipe(gulpif(args.watch, livereload()));
});

