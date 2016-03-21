# textlint Chrome Extension

[![Build Status](https://travis-ci.org/io-monad/textlint-chrome-extension.svg?branch=master)](https://travis-ci.org/io-monad/textlint-chrome-extension) [![GitHub license](https://img.shields.io/github/license/io-monad/textlint-chrome-extension.svg)](LICENSE)

Chrome Extension that proofreads `<textarea>` using [textlint](http://textlint.github.io/).

:construction: Work In Progress!

:rocket: The extension experimentally supports Firefox ([WebExtensions](https://developer.mozilla.org/en-US/Add-ons/WebExtensions)) and Opera. Check out the "[Experimental support](#experimental-support)" section for more details.

## How to build

    $ npm install
    $ npm run build

To test the built extension, load `dist/chrome` directory into Chrome.

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

## Experimental support

This extension can also work on browsers implementing Chrome-compatible extension API, such as Firefox and Opera.

Please note that we take Chrome as the main target of this project and thus some features may not work properly on other browsers.

### How to build

    $ gulp build --vendor=moz    // for Firefox
    $ gulp build --vendor=opera  // for Opera

### Installation

For Firefox, please make sure you have Firefox 45 or higher, and follow the instructions at https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Packaging_and_installation to load `dist/moz` directory.

For Opera, please follow the instructions at https://dev.opera.com/extensions/testing/ to load `dist/opera` directory.

### Limitations

Due to the incompatibilities with Chrome's original extension API, there are some limitations on features. These limitations may go away if API supports on browsers are improved.

#### Firefox

- User selections in the popup panel will not be remembered. (Due to [Bug 1258139](https://bugzilla.mozilla.org/show_bug.cgi?id=1258139 "1258139 – storage.local doesn't save data from popup script, only after browser restart extension gets access to saved data"))
- Custom rule settings will not work. (Due to [Bug 1258139](https://bugzilla.mozilla.org/show_bug.cgi?id=1258139 "1258139 – storage.local doesn't save data from popup script, only after browser restart extension gets access to saved data"))
- Icons in result tooltips will not be shown properly. (Due to [Bug 1207394](https://bugzilla.mozilla.org/show_bug.cgi?id=1207394 "1207394 – Make sure web_accessible_resources work with CSP/mixed content blocking"))
- All configurations will not be synced. (Due to [Bug 1220494](https://bugzilla.mozilla.org/show_bug.cgi?id=1220494 "1220494 – [tracking] Implement chrome.storage.sync"))
- textlint processes will not be run in a sandbox.
(i.e. there is no protection around rule executions.)

#### Opera

None.

## License

This software is licensed under [GNU GPLv3](https://www.gnu.org/copyleft/gpl.html). See [LICENSE](LICENSE) for full text of the license.

Before version 2.0.0, this extension was licensed under The MIT License. Since this extension started to bundle some GPLv3 plugins, I decided to re-license the extension under GPLv3.
