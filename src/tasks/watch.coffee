watch = require 'gulp-watch'

{
  runSequence
  gulp
} = require('../refs').vendor

gulp().task 'webapp-watch', ['parched-watch'], ->
  watch ['app/scripts/**/*'], (files, cb) ->
    runSequence 'parched-before',
      'webapp-lint-app-scripts'
      'parched-after'
      cb

  watch ['app/styles/**/*'], (files, cb) ->
    runSequence 'parched-before',
      'webapp-build-app-styles'
      'webapp-build-final-styles'
      'parched-after'
      cb

  watch ['app/assets/**/*'], (files, cb) ->
    runSequence 'parched-before',
      'webapp-build-app-assets'
      'parched-after'
      cb

  watch ['app/views/**/*'], (files, cb) ->
    runSequence 'parched-before',
      'webapp-build-app-views'
      'parched-after'
      cb

  watch ['vendor/scripts/**/*'], (files, cb) ->
    runSequence 'parched-before',
      'webapp-build-vendor-scripts'
      'webapp-build-final-scripts'
      'parched-after'
      cb

  watch ['vendor/styles/**/*'], (files, cb) ->
    runSequence 'parched-before',
      'webapp-build-vendor-styles'
      'webapp-build-final-styles'
      'parched-after'
      cb

  watch ['vendor/assets/**/*'], (files, cb) ->
    runSequence 'parched-before',
      'webapp-build-vendor-assets'
      'parched-after'
      cb

  watch ['vendor/views/**/*'], (files, cb) ->
    runSequence 'parched-before',
      'webapp-build-vendor-views'
      'parched-after'
      cb

  watch ['bower_components/**/*'], (files, cb) ->
    runSequence 'parched-before',
      [
        'webapp-build-bower-assets'
        'webapp-build-bower-scripts'
        'webapp-build-bower-styles'
      ]
      [
        'webapp-build-final-scripts'
        'webapp-build-final-styles'
      ]
      'parched-after'
      cb

  undefined
