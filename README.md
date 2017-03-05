# electron-aware
[![Build Status](https://travis-ci.org/Heartnett/electron-aware.svg?branch=master)](https://travis-ci.org/Heartnett/electron-aware) [![depencencies Status](https://david-dm.org/Heartnett/electron-aware.svg)](https://david-dm.org/Heartnett/electron-aware) [![devDependency Status](https://david-dm.org/Heartnett/electron-aware/dev-status.svg)](https://david-dm.org/Heartnett/electron-aware?type=dev) [![Version npm](https://img.shields.io/npm/v/electron-aware.svg?style=flat-square)](https://www.npmjs.com/package/electron-aware) [![npm Downloads](https://img.shields.io/npm/dm/electron-aware.svg?style=flat-square)](https://www.npmjs.com/package/electron-aware) [![Coverage Status](https://coveralls.io/repos/github/Heartnett/electron-aware/badge.svg?branch=master)](https://coveralls.io/github/Heartnett/electron-aware?branch=master)

[![NPM](https://nodei.co/npm/electron-aware.png?downloads=true)](https://nodei.co/npm/electron-aware/)

A library that enables communication with the main Electron process.

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
const gulp = require('gulp');
const aware = require('electron-aware');

gulp.task('serve', () => {
    // this will activate electron-aware
    aware.start();
    
    // any changes made to the index.html file will refresh the electron app 
    gulp.watch('./index.html', aware.refresh);
    
    // any changes made to the electron main process file,
    // will cause electron to restart 
    gulp.watch('./main.js', aware.reload);
});
```
To get your electron app to work with `electron-aware`, as intended, a couple of lines of code need to be added to the main.js file (or whatever you named your electron main process file).

```javascript
const {app, BrowserWindow} = require('electron');
...
// the 'main' property must only be used inside the electron process!
const aware = require('electron-aware').main;
```

The next bit of code must be called on the `ready` or `activate` app events.

```javascript
let window = new BrowserWindow({ /* you options here - its up to you :) */ });
...
// the window parameter is required, in order for electron-aware to work
aware.initialize(window);
```