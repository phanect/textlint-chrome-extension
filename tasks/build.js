import { series, parallel } from "gulp";

import { bower } from "./bower.js";
import { clean } from "./clean.js";
import { dict } from "./dict.js";
import { fonts } from "./fonts.js";
import { images } from "./images.js";
import { license } from "./license.js";
import { livereload } from "./livereload.js";
import { locales } from "./locales.js";
import { manifest } from "./manifest.js";
import { pages } from "./pages.js";
import { scripts } from "./scripts.js";
import { styles } from "./styles.js";
import { vendor } from "./vendor.js";

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
  )
);
