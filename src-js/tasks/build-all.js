import browserSync from 'browser-sync'

import {
  getConfig,
} from '../ConfigStore'

import {
  gulpSort,
  vendor,
} from '../refs'

let config = getConfig()

let defaultBrowserSyncOptions = {
  notify: false,
  ghostMode: true,
  server: {
    baseDir: config.paths.public
  }
}

vendor.gulp().task('webapp-build-all', (done) => {
  let sequence = [
    // Run before callbacks
    'parched-before',

    // First we build the assets
    // These should be first since other steps may depend on them
    [
      'webapp-build-app-assets',
      'webapp-build-vendor-assets',
      'webapp-build-bower-assets',
    ],

    // Then we build views
    [
      'webapp-build-app-views',
      'webapp-build-vendor-views',
    ],

    // Then we build all scripts and styles
    [
      'webapp-lint-app-scripts',
      'webapp-build-app-scripts',
      'webapp-build-vendor-scripts',
      'webapp-build-bower-scripts',
      'webapp-build-app-styles',
      'webapp-build-vendor-styles',
      'webapp-build-bower-styles',
    ],

    // Then we build the final script and style bundles
    [
      'webapp-build-final-scripts',
      'webapp-build-final-styles',
    ],

    // Run after callbacks
    'parched-after',

    () => {
      if (global.isWatching) {
        browserSync(vendor.xtend(
          {},
          defaultBundleOptions,
          config.browserSyncOptions
        ))
      }
      return done(...arguments)
    },
  ]
})
