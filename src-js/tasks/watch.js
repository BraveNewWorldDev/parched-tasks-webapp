import watch from 'gulp-watch'
import { vendor } from '../refs'

import {
  getConfig,
} from '../ConfigStore'

let config = getConfig()

function watchAndRunSequence (watchPath, ...sequence) {
  watch(watchPath, function (file) {
    console.log(arguments)
    return vendor.runSequence('parched-before', ...sequence, 'parched-after')
  })
}

vendor.gulp().task('webapp-watch', ['parched-watch', 'webapp-build-all'], () => {
  let paths = config.paths

  watchAndRunSequence(
    paths.appScripts,
    'webapp-lint-app-scripts'
  )

  watchAndRunSequence(
    paths.appStyles,
    'webapp-build-app-styles',
    'webapp-build-final-styles'
  )

  watchAndRunSequence(
    paths.appAssets,
    'webapp-build-app-assets'
  )

  watchAndRunSequence(
    paths.appViews,
    'webapp-build-app-views'
  )

  watchAndRunSequence(
    paths.vendorScripts,
    'webapp-build-vendor-scripts',
    'webapp-build-final-scripts'
  )

  watchAndRunSequence(
    paths.vendorStyles,
    'webapp-build-vendor-styles',
    'webapp-build-final-styles'
  )

  watchAndRunSequence(
    paths.vendorAssets,
    'webapp-build-vendor-assets'
  )

  watchAndRunSequence(
    paths.vendorViews,
    'webapp-build-vendor-views'
  )

  watchAndRunSequence(
    paths.bowerAssets,
    [
      'webapp-build-bower-assets',
      'webapp-build-bower-scripts',
      'webapp-build-bower-styles'
    ],
    [
      'webapp-build-final-scripts',
      'webapp-build-final-styles'
    ]
  )
})
