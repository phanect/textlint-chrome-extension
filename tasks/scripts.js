import path from "path";
import _ from "lodash";
import gulp, { series } from "gulp";
import gulpif from "gulp-if";
import webpack from "webpack";
import gulpWebpack from "webpack-stream";
import sourcemaps from "gulp-sourcemaps";
import espower from "gulp-espower";
import livereload from "gulp-livereload";
import plumber from "gulp-plumber";
import notify from "gulp-notify";
import named from "vinyl-named";
import args from "./lib/args";
import { bundle, bundleTest } from "./bundle.js";

const rootDir = path.join(__dirname, "..");
const scriptsDir = `${rootDir}/app/scripts`;

function getWebpackConfig(testing) {
  return {
    output: testing ? { filename: "tests.js" } : {
      filename: "[name].js",
      publicPath: "/scripts/",
    },
    devtool: (testing && args.watch) || (!testing && args.sourcemaps) ?
      "inline-source-map" : false,
    watch: args.watch,
    plugins: [
      new webpack.IgnorePlugin(
        /package\.json$|\.md$|\.d\.ts$/
      ),
      new webpack.DefinePlugin({
        "__ENV__": JSON.stringify(args.production ? "production" : "development"),
        "__VENDOR__": JSON.stringify(args.vendor),
        "DEBUG": !args.production && !testing,
        "LIVERELOAD": args.watch && !testing,
        "process.env": {
          "NODE_ENV": JSON.stringify(args.production ? "production" : "development"),
        },
      }),
    ].concat(args.production ? [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.AggressiveMergingPlugin(),
      new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }),
    ] : []),
    module: {
      rules: [
        {
          test: /node_modules\/kuromoji\/dist\/node\/TokenizerBuilder\.js/,
          enforce: "pre",
          loader: "string-replace-loader",
          query: {
            search: "./loader/NodeDictionaryLoader.js",
            replace: `${scriptsDir}/shim/kuromoji/ChromeDictionaryLoader.js`,
          },
        },
        {
          test: /node_modules\/kuromojin\/lib\/kuromojin\.js/,
          enforce: "pre",
          loader: "string-replace-loader",
          query: {
            search: "require.resolve(\"kuromoji\")",
            replace: "\"\"",
          },
        },
        {
          test: /node_modules\/sorted-array\/sorted-array\.js/,
          enforce: "pre",
          loader: "string-replace-loader",
          query: {
            search: "define(SortedArray);",
            replace: "void(0);",
          },
        },
        {
          test: /node_modules\/prh\/lib\/index\.js/,
          enforce: "pre",
          loader: "string-replace-loader",
          query: {
            search: "fs.readFileSync",
            replace: `require("${scriptsDir}/shim/prh/fs-mock").readFileSync`,
          },
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: "babel-loader",
        },
        {
          test: /node_modules\/regx\/src\/regx\.js$/,
          loader: "babel-loader",
        },
        {
          test: /interop-require|try-resolve|require-like|textlint-formatter/,
          loader: "null-loader",
        },
      ],
    },
    node: {
      process: "mock",
      fs: "empty",
      module: "empty",
    },
    resolve: {
      alias: _.extend({
        // Avoid "This seems to be a pre-built javascript file" warning.
        regx: `${rootDir}/node_modules/regx/src/regx.js`,
      }, testing ? {
        [`${scriptsDir}/lib/app/bundles`]: "tmp/bundle/bundles.js",
      } : {}),
    },
    externals(context, request, callback) {
      if (!/node_modules/.test(context)) {
        // Replace jquery and lodash used in app with global variables
        if (request === "jquery") {
          callback(null, "var jQuery");
          return;
        }
        if (request === "lodash") {
          callback(null, "var _");
          return;
        }
      }
      callback();
    },
  };
}

export const scripts = series(bundle, () => {
  return gulp.src(["app/scripts/*.js"])
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>"),
    }))
    .pipe(named())
    .pipe(gulpWebpack(getWebpackConfig(false)))
    .pipe(gulp.dest(`dist/${args.vendor}/scripts`))
    .pipe(gulpif(args.watch, livereload()));
});

export function buildForTest() {
  if (args.watch) {
    return gulp.src(["tests/entry.js"])
      .pipe(gulpWebpack(getWebpackConfig(true)))
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(espower())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest("tmp/scripts"));
  } else {
    return gulp.src(["tests/entry.js"])
      .pipe(gulpWebpack(getWebpackConfig(true)))
      .pipe(gulp.dest("tmp/scripts"));
  }
}

export const scriptsTest = series(bundleTest, () => {
  return buildForTest();
});
