# textlint Chrome Extension

[![Build Status](https://travis-ci.org/io-monad/textlint-chrome-extension.svg?branch=master)](https://travis-ci.org/io-monad/textlint-chrome-extension) [![GitHub license](https://img.shields.io/github/license/io-monad/textlint-chrome-extension.svg)](LICENSE)

Chrome Extension that proofreads textarea using [textlint](http://textlint.github.io/).

Work In Progress!

## How to build

    $ npm install
    $ npm run build

To test the built extension, load `dist` directory into Chrome.

## Tasks

### Watch build

Watch file changes and build it continuously.

    $ npm run watch

### Pack

Produce a production-packaged zip in `packages` directory.

    $ npm run pack

### Version

Increment version number of `manifest.json` and `package.json`, then commit the change to git and add a git tag.

    $ gulp patch      // => 0.0.X
    $ gulp feature    // => 0.X.0
    $ gulp release    // => X.0.0

### License

This software is licensed under [GNU GPLv3](https://www.gnu.org/copyleft/gpl.html). See [LICENSE](LICENSE) for full text of the license.

Before version 2.0.0, this extension was licensed under The MIT License. Since this exntension started to bundle some GPLv3 plugins, I decided to re-license the extension under GPLv3.
