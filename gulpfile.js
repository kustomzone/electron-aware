"use strict";

const gulp = require('gulp');
const buble = require("gulp-buble");
const eslint = require('gulp-eslint');
const pump = require("pump");
const uglify = require("gulp-uglify");

const source = "./src/**/*.js";

gulp.task('lint', () => {
    return gulp
        .src(["./index.js", source])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

gulp.task("build", ["lint"], (callback) => {
    pump([
        gulp.src(source),
        buble(),
        uglify(),
        gulp.dest("./dest")
    ], callback);
});