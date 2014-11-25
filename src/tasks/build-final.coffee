concat = require 'gulp-concat'

{
  gulp
} = require('../refs').vendor

{
  gulpSort
  isProduction
  addPluginMethodsToStream
} = require '../refs'

{
  browserSyncReload
} = require '../browser-sync'

{
  sourcemapsInit
  sourcemapsWrite
} = require '../sourcemaps'

{
  getConfig
} = require '../config'


gulp().task 'webapp-build-final-styles', ->
  config = getConfig()

  stream = gulp()
    .src [
      'tmp/webapp/00-**/*.css'
      'tmp/webapp/99-**/*.css'
    ]

    .pipe gulpSort {
      before: config.files.order.before
      after: config.files.order.after
    }

    .pipe sourcemapsInit()
    .pipe concat('app.css')
    .pipe sourcemapsWrite()

  if isProduction()
    stream = addPluginMethodsToStream {
      stream
      methodNames: ['minify']
    }

  stream
    .pipe gulp().dest('public')
    .pipe browserSyncReload()

  stream


gulp().task 'webapp-build-final-scripts', ->
  config = getConfig()

  stream = gulp()
    .src [
      'tmp/webapp/00-**/*.js'
      'tmp/webapp/99-**/*.js'
    ]

    .pipe gulpSort {
      before: config.files.order.before
      after: config.files.order.after
    }

    .pipe sourcemapsInit()
    .pipe concat('app.js')
    .pipe sourcemapsWrite()

  if isProduction()
    stream = addPluginMethodsToStream {
      stream
      methodNames: ['minify']
    }

  stream
    .pipe gulp().dest('public')
    .pipe browserSyncReload()

  stream
