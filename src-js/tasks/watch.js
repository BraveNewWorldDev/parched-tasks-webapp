import watch from 'gulp-watch'
import { vendor } from '../refs'

const src = {
  appScripts: [
    'app/scripts/**/*',
  ],

  appStyles: [
    'app/styles/**/*',
  ],

  appAssets: [
    'app/assets/**/*',
  ],

  appViews: [
    'app/views/**/*',
  ],

  vendorScripts: [
    'vendor/scripts/**/*',
  ],

  vendorStyles: [
    'vendor/styles/**/*',
  ],

  vendorAssets: [
    'vendor/assets/**/*',
  ],

  vendorViews: [
    'vendor/views/**/*',
  ],

  bowerAssets: [
    'bower_components/**/*',
  ],

}

function watchAndRunSequence (watchPath, sequence) {
  watch(watchPath, (files, done) => {
    return runSequence('parched-before', ...sequence, 'parched-after', done)
  })
}

vendor.gulp().task('webapp-watch', ['parched-watch', 'webapp-build-all'], () => {
  watchAndRunSequence(
    src.appScripts,
    'webapp-lint-app-scripts'
  )

  watchAndRunSequence(
    src.appStyles,
    'webapp-build-app-styles',
    'webapp-build-final-styles'
  )

  watchAndRunSequence(
    src.appAssets,
    'webapp-build-app-assets'
  )

  watchAndRunSequence(
    src.appViews,
    'webapp-build-app-views'
  )

  watchAndRunSequence(
    src.vendorScripts,
    'webapp-build-vendor-scripts',
    'webapp-build-final-scripts'
  )

  watchAndRunSequence(
    src.vendorStyles,
    'webapp-build-vendor-styles',
    'webapp-build-final-styles'
  )

  watchAndRunSequence(
    src.vendorAssets,
    'webapp-build-vendor-assets'
  )

  watchAndRunSequence(
    src.vendorViews,
    'webapp-build-vendor-views'
  )

  watchAndRunSequence(
    src.bowerAssets,
    [
      [
        'webapp-build-bower-assets',
        'webapp-build-bower-scripts',
        'webapp-build-bower-styles'
      ], [
        'webapp-build-final-scripts',
        'webapp-build-final-styles'
      ]
    ]
  )
})
