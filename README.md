# electron-aware [![Build Status](https://travis-ci.org/Heartnett/electron-aware.svg?branch=master)](https://travis-ci.org/Heartnett/electron-aware)
A library that enables communication with the main Electron process.

---
## Installation
With NPM - `npm install electron-aware`
With Yarn - `yarn add electron-aware`

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