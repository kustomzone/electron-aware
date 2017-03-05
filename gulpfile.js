"use strict";

const gulp = require('gulp');
const jshint = require('gulp-jshint');
const stylish = require("jshint-stylish");

gulp.task('test', () => {
    return gulp
        .src(['./index.js', './lib/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .pipe(jshint.reporter('fail'));
});