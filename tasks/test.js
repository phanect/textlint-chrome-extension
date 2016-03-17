import gulp from 'gulp';
import gutil from 'gulp-util';
import karma from 'karma';
import through from 'through2';
import del from 'del';
import args from './lib/args';
import {buildForTest} from './scripts';

gulp.task('test:clean', () => {
  return del('tmp/scripts');
});

gulp.task('test', ['test:clean', 'bundle:test'], (taskDone) => {
  let server;
  buildForTest()
    .pipe(through.obj(function (file, enc, done) {
      this.push(file);

      if (/\.map$/.test(file.path)) {
        // Skip sourcemap
        return done();
      }

      if (server) {
        server.refreshFiles();
        return done();
      }

      server = new karma.Server({
        configFile: __dirname + '/../karma.conf.js',
        browsers: args.watch ? ['Chrome', 'PhantomJS'] : ['PhantomJS'],
        singleRun: !args.watch
      }, (exitCode) => {
        if (exitCode !== 0) {
          this.emit("error", new gutil.PluginError("karma", `Karma exit with code ${exitCode}`));
        }
        done();
        taskDone && taskDone();
        process.exit(exitCode);
      });

      server.start();
    }))
    .on("error", (e) => {
      console.error("Error on pipe:", (e.message || e));
      taskDone && taskDone(e);
      taskDone = null;
    });
});
