# electron-aware

>Library that enables communication with the main Electron process.

[![Greenkeeper badge](https://badges.greenkeeper.io/Heartnett/electron-aware.svg)](https://greenkeeper.io/) [![Build Status](https://travis-ci.org/Heartnett/electron-aware.svg?branch=master)](https://travis-ci.org/Heartnett/electron-aware) [![Dependency Status](https://gemnasium.com/badges/github.com/Heartnett/electron-aware.svg)](https://gemnasium.com/github.com/Heartnett/electron-aware) [![devDependency Status](https://david-dm.org/Heartnett/electron-aware/dev-status.svg)](https://david-dm.org/Heartnett/electron-aware?type=dev) [![Version npm](https://img.shields.io/npm/v/electron-aware.svg?style=flat-square)](https://www.npmjs.com/package/electron-aware) [![npm Downloads](https://img.shields.io/npm/dm/electron-aware.svg?style=flat-square)](https://www.npmjs.com/package/electron-aware) [![license](https://img.shields.io/github/license/Heartnett/electron-aware.svg)](https://github.com/Heartnett/electron-aware/blob/master/LICENSE) [![Gratipay User](https://img.shields.io/gratipay/user/Heartnett.svg)](https://gratipay.com/Heartnett/) [![Package Quality](http://npm.packagequality.com/shield/electron-aware.svg)](http://packagequality.com/#?package=electron-aware) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

[![NPM](https://nodei.co/npm/electron-aware.png?downloads=true)](https://nodei.co/npm/electron-aware/) 
[![Package Quality](http://npm.packagequality.com/badge/electron-aware.png)](http://packagequality.com/#?package=electron-aware)
[![JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)


---
## Installation
```sh
# Install as a development dependency (NPM)
npm install electron-aware --save-dev
# OR
# Install as a development dependency (Yarn)
yarn add electron-aware --dev
```
---
## Usage

`electron-aware` can be used inside a gulp file to enable live reloading of your electron app.

```javascript
const gulp = require('gulp')
const awareServer = require('electron-aware/server')

gulp.task('serve', () => {
  // this will activate electron-aware
  awareServer.start()
  
  // any changes made to the index.html file will refresh the electron app 
  gulp.watch('./index.html', awareServer.refresh)
  
  // any changes made to the electron main process file,
  // will cause electron to restart 
  gulp.watch('./main.js', awareServer.reload)
});
```
To get your electron app to work with `electron-aware`, as intended, a couple of lines of code need to be added to the main.js file (or whatever you named your electron main process file).

```javascript
const {app, BrowserWindow} = require('electron')
...
// the 'main' sub-module must only be used inside the electron process!
const aware = require('electron-aware/main')
```

The next bit of code must be called on the `ready` or `activate` app events.

```javascript
let window = new BrowserWindow({ /* your options here - its up to you :) */ });
...
// the window parameter is required, in order for electron-aware to work
aware.initialize(window);
```

`electron-aware` also allows you to create, subscribe, and raise custom events!
On the server-side:
```javascript
// subscribe to the 'my-custom-event' (raised by the client)
aware.on('my-custom-event', (args) => {
    // some logic
    ...
    // raise the 'my-other-custom-event' on the client
    aware.send('my-other-custom-event', /* your arguments here (optional) */)
})
```
On the client-side (electron main process):
```javascript
...
// reference the client object
const awareClient = aware.initialize(window)
// subscribe to the 'my-other-custom-event' (raised by the server)
awareClient.on('my-other-custom-event', (args) => {
    // some logic
})

// raise the 'my-custom-event' on the server
awareClient.send('message', { event: 'my-custom-event', args: /* your arguments here (optional) */ })
```

----
## License
[MIT](https://github.com/heartnett/electron-aware/blob/master/LICENSE)

----
## Donating
Please support this project via [gratipay](https://gratipay.com/Heartnett/).

[![Support via Gratipay](https://cdn.rawgit.com/gratipay/gratipay-badge/2.3.0/dist/gratipay.svg)](https://gratipay.com/Heartnett/)
