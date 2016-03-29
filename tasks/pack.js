import gulp from "gulp";
import { colors, log } from "gulp-util";
import zip from "gulp-zip";
import packageDetails from "../package.json";
import args from "./lib/args";

gulp.task("pack", ["build"], () => {
  const name = packageDetails.name;
  const version = packageDetails.version;
  const ext = {
    chrome: "zip",
    opera: "zip",
    moz: "xpi",
  }[args.vendor];
  const filename = `${name}-${version}-${args.vendor}.${ext}`;

  return gulp.src(`dist/${args.vendor}/**/*`)
    .pipe(zip(filename))
    .pipe(gulp.dest("./packages"))
    .on("end", () => {
      const distStyled = colors.magenta(`dist/${args.vendor}`);
      const filenameStyled = colors.magenta(`./packages/${filename}`);
      log(`Packed ${distStyled} to ${filenameStyled}`);
    });
});
