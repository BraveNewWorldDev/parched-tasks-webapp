browserSync = require 'browser-sync'

{
  gulpSort
} = require '../refs'

{
  gulp
  runSequence
} = require('../refs').vendor

gulp().task 'webapp-build-all', (done) ->
  sequence = [
    'parched-before'
    ['webapp-build-app-assets', 'webapp-build-vendor-assets', 'webapp-build-bower-assets']
    ['webapp-build-app-views', 'webapp-build-vendor-views']

    [
      'webapp-lint-app-scripts'
      'webapp-build-app-scripts'
      'webapp-build-vendor-scripts'
      'webapp-build-bower-scripts'
      'webapp-build-app-styles'
      'webapp-build-vendor-styles'
      'webapp-build-bower-styles'
    ]

    #['webapp-lint-app-scripts', 'webapp-build-app-scripts', 'webapp-build-vendor-scripts', 'webapp-build-bower-scripts']
    #['webapp-build-app-styles', 'webapp-build-vendor-styles', 'webapp-build-bower-styles']
    ['webapp-build-final-scripts', 'webapp-build-final-styles']
    'parched-after'
    ->
      if global.isWatching
        browserSync {
          notify: false
          ghostMode: true
          server:
            baseDir: 'public'
        }

      done arguments...
  ]

  runSequence sequence...
