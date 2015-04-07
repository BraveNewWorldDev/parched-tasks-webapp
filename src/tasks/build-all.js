import browserSync from 'browser-sync'

import {
  getConfig,
} from '../ConfigStore'

import {
  addDependencyToBuild,
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

vendor.gulp().task('webapp-build-all', false, (done) => {
  let tasksForAssets = []
  let tasksForViews = []
  let tasksForScripts = []
  let tasksForStyles = []

  Object.keys(config.bundles).forEach((bundleName) => {
    tasksForAssets.push(`webapp-build-assets--${bundleName}`)
    tasksForViews.push(`webapp-build-views--${bundleName}`)
    tasksForScripts.push(`webapp-build-scripts--${bundleName}`)
    tasksForStyles.push(`webapp-build-styles--${bundleName}`)
  })

  tasksForAssets = tasksForAssets.concat([
    'webapp-build-vendor-assets',
    'webapp-build-bower-assets',
  ])

  tasksForViews = tasksForViews.concat([
    'webapp-build-vendor-views',
  ])

  let allScriptStyleTasks = tasksForScripts
      .concat(tasksForStyles)
      .concat([
        'webapp-build-vendor-scripts',
        'webapp-build-bower-scripts',
        'webapp-build-vendor-styles',
        'webapp-build-bower-styles',
      ])

  let __sequence = [
    'parched-before',
    tasksForAssets,
    tasksForViews,
    allScriptStyleTasks,
    [
      'webapp-build-final-scripts',
      'webapp-build-final-styles',
    ],
    'parched-after',
    () => {
      if (global.isWatching) {
        browserSync(vendor.xtend(
          {},
          defaultBrowserSyncOptions,
          config.browserSyncOptions
        ))
      }

      // TODO the first argument is an empty object now??
      // maybe something is returning when it shouldn't
      if (Object.keys(arguments[0]).length === 0) {
        let args = Array.prototype.slice.call(arguments, 1)
        return done(null, ...args)
      }

      return done(...arguments)
    },
  ]

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
          defaultBrowserSyncOptions,
          config.browserSyncOptions
        ))
      }

      // TODO the first argument is an empty object now??
      // maybe something is returning when it shouldn't
      if (Object.keys(arguments[0]).length === 0) {
        let args = Array.prototype.slice.call(arguments, 1)
        return done(null, ...args)
      }

      return done(...arguments)
    },
  ]

  //console.dir(sequence)
  //console.dir(__sequence)
  //done()
  vendor.runSequence(...__sequence)
  //vendor.runSequence([[]])
})

addDependencyToBuild('webapp-build-all')
