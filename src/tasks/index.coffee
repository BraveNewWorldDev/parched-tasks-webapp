cachedForTaskName = require '../cached'
rememberForTaskName = require '../remember'

{
  browserSyncReload
} = require '../browser-sync'

{
  sourcemapsInit
  sourcemapsWrite
} = require '../sourcemaps'

{
  createTask
} = require '../refs'

{
  gulp
  gutil
  runSequence
} = require('../refs').vendor

require './build-bower'
require './build-app-scripts'
require './build-final'
require './build-all'
require './watch'
require './clean'


createTask {
  taskName: 'webapp-lint-app-scripts'
  src: [
    'app/scripts/**/*'
  ]

  sequence: [
    'lint'
  ]

  beforeEach: (stream, callbackContext) ->
    stream
      .pipe cachedForTaskName(callbackContext)

  afterEach: (stream, callbackContext) ->
    stream
      .pipe rememberForTaskName(callbackContext)
}


createTask {
  taskName: 'webapp-build-app-styles'
  src: [
    'app/styles/**/*'
  ]

  sequence: [
    ['lint', 'transform']
  ]

  beforeTransform: (stream) ->
    stream = stream
      .pipe sourcemapsInit()

  beforeEach: (stream, callbackContext) ->
    stream
      .pipe cachedForTaskName(callbackContext)

  afterEach: (stream, callbackContext) ->
    stream
      .pipe rememberForTaskName(callbackContext)

  afterTransform: (stream, callbackContext) ->
    stream = stream
      .pipe sourcemapsWrite()
      .pipe gulp().dest 'tmp/webapp/99-app'
}


createTask {
  taskName: 'webapp-build-app-assets'
  shouldProcessAssets: true
  src: [
    'app/assets/**/*'
  ]

  sequence: [
    'transform'
  ]

  afterTransform: (stream) ->
    stream
      .pipe gulp().dest('public')
      .pipe browserSyncReload()
}


createTask {
  taskName: 'webapp-build-app-views'
  src: [
    'app/views/**/*'
  ]

  sequence: [
    ['lint', 'transform']
  ]

  afterTransform: (stream) ->
    stream
      .pipe gulp().dest('public')
      .pipe browserSyncReload()
}


createTask {
  taskName: 'webapp-build-vendor-scripts'
  src: [
    'vendor/scripts/**/*'
  ]

  sequence: [
    'transform'
  ]

  beforeTransform: (stream) ->
    stream
      .pipe sourcemapsInit()

  beforeEach: (stream, callbackContext) ->
    stream
      .pipe cachedForTaskName(callbackContext)

  afterEach: (stream, callbackContext) ->
    stream
      .pipe rememberForTaskName(callbackContext)

  afterTransform: (stream, callbackContext) ->
    stream
      .pipe sourcemapsWrite()
      .pipe gulp().dest('tmp/webapp/00-vendor')
}


createTask {
  taskName: 'webapp-build-vendor-styles'
  src: [
    'vendor/styles/**/*'
  ]

  sequence: [
    'transform'
  ]

  beforeTransform: (stream) ->
    stream
      .pipe sourcemapsInit()

  beforeEach: (stream, callbackContext) ->
    stream
      .pipe cachedForTaskName(callbackContext)

  afterEach: (stream, callbackContext) ->
    stream
      .pipe rememberForTaskName(callbackContext)

  afterTransform: (stream, callbackContext) ->
    stream
      .pipe sourcemapsWrite()
      .pipe gulp().dest('tmp/webapp/00-vendor')
}


createTask {
  taskName: 'webapp-build-vendor-assets'
  shouldProcessAssets: true
  src: [
    'vendor/assets/**/*'
  ]

  sequence: [
    'transform'
  ]

  afterTransform: (stream) ->
    stream
      .pipe gulp().dest('public')
      .pipe browserSyncReload()
}


createTask {
  taskName: 'webapp-build-vendor-views'
  src: [
    'vendor/views/**/*'
  ]

  sequence: [
    'transform'
  ]

  afterTransform: (stream) ->
    stream
      .pipe gulp().dest('public')
      .pipe browserSyncReload()
}
