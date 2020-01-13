import del from "del";
import args from "./lib/args";

export function clean() {
  return del([`dist/${args.vendor}/**/*`, "tmp"]);
}
