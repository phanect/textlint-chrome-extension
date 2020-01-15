import { series, parallel } from "gulp";

import { bower } from "./bower";
import { clean } from "./clean";
import { dict } from "./dict";
import { fonts } from "./fonts";
import { images } from "./images";
import { license } from "./license";
import { livereload } from "./livereload";
import { locales } from "./locales";
import { manifest } from "./manifest";
import { pages } from "./pages";
import { scripts } from "./scripts";
import { styles } from "./styles";
import { vendor } from "./vendor";

export const build = series(
  clean,
  parallel(
    fonts,
    dict,
  ),
  parallel(
    manifest,
    license,
    scripts,
    styles,
    pages,
    locales,
    images,
    vendor,
    bower,
    livereload,
  ),
);
