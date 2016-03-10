# textlint Chrome Extension

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

Note: You must put a secret key file `certs/key.pem` before.

### Version

Increment version number of `manifest.json` and `package.json`, then commit the change to git and add a git tag.

    $ gulp patch      // => 0.0.X
    $ gulp feature    // => 0.X.0
    $ gulp release    // => X.0.0
