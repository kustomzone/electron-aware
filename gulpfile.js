'use strict'

const gulp = require('gulp')
const buble = require('gulp-buble')
const standard = require('gulp-standard')
const pump = require('pump')
const uglify = require('gulp-uglify')

const source = './src/**/*.js'

gulp.task('lint', () => {
  return gulp
        .src(['./index.js', source])
        .pipe(standard())
        .pipe(standard.reporter('default', {
          breakOnError: true,
          quiet: true
        }))
})

gulp.task('build', ['lint'], (callback) => {
  pump([
    gulp.src(source),
    buble(),
    uglify(),
    gulp.dest('./dist')
  ], callback)
})
