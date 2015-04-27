import browserSync from 'browser-sync'

import {
  getConfig,
} from '../ConfigStore'

import {
  addDependencyToBuild,
  gulpSort,
  vendor,
} from '../refs'

import {
  getDependenciesFor,
} from '../DependencyStore'

let config = getConfig()

let defaultBrowserSyncOptions = {
  notify: false,
  ghostMode: true,
  server: {
    baseDir: config.paths.public
  }
}

vendor.gulp().task('webapp-build-all', false, (done) => {
  let sequence = [
    'parched-before',

    getDependenciesFor('assets'),
    getDependenciesFor('views'),

    [].concat('webapp-build-browserify')
      .concat(getDependenciesFor('scripts'))
      .concat(getDependenciesFor('styles')),

    [].concat(getDependenciesFor('finalScripts'))
      .concat(getDependenciesFor('finalStyles'))
      .concat(getDependenciesFor('finalAssets')),

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

  console.dir(sequence)
  vendor.runSequence(...sequence)
})

addDependencyToBuild('webapp-build-all')
