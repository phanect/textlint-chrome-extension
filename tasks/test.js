import { series } from "gulp";
import gutil from "gulp-util";
import karma from "karma";
import through from "through2";
import del from "del";
import args from "./lib/args";
import { bundleTest } from "./bundle.js";
import { lint } from "./lint.js";
import { buildForTest } from "./scripts";

const testClean = () => {
  return del("tmp/scripts");
};

const testRun = (taskDone) => {
  let server;
  buildForTest()
    .pipe(through.obj(function (file, enc, done) {
      this.push(file);

      if (/\.map$/.test(file.path)) {
        // Skip sourcemap
        done();
        return;
      }

      if (server) {
        server.refreshFiles();
        done();
        return;
      }

      server = new karma.Server({
        configFile: `${__dirname}/../karma.conf.js`,
        browsers: args.watch ? ["Chrome", "PhantomJS"] : ["PhantomJS"],
        singleRun: !args.watch,
      }, (exitCode) => {
        if (exitCode !== 0) {
          this.emit("error", new gutil.PluginError("karma", `Karma exit with code ${exitCode}`));
        }
        done();
        if (taskDone) taskDone();
        process.exit(exitCode);
      });

      server.start();
    }))
    .on("error", (e) => {
      console.error("Error on pipe:", (e.message || e));
      if (taskDone) taskDone(e);
      taskDone = null;
    });
};

export const test = series(
  testClean,
  lint,
  bundleTest,
  testRun,
);
