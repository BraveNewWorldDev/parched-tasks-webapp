import watch from 'gulp-watch'
import {
  addDependencyToWatch,
  vendor,
} from '../refs'

import {
  getConfig,
} from '../ConfigStore'

import {
  getDependenciesFor,
} from '../DependencyStore'

let config = getConfig()

function watchAndRunSequence (watchPath, ...sequence) {
  let validSequence = sequence.filter(x => !!x)

  watch(watchPath, function (file) {
    return vendor.runSequence('parched-before', ...validSequence, 'parched-after')
  })
}

vendor.gulp().task('webapp-watch', false, () => {
  let paths = config.paths
  let finalVendorStyleTasks = []

  Object.keys(config.bundles).forEach((bundleName) => {
    let bundleConfig = config.bundles[bundleName]

    watchAndRunSequence(
      `${bundleConfig.src}/scripts/**/*`,
      `webapp-lint-scripts--${bundleName}`
    )

    watchAndRunSequence(
      `${bundleConfig.src}/styles/**/*`,
      `webapp-build-styles--${bundleName}`,
      `webapp-build-final-styles--${bundleName}`
    )

    watchAndRunSequence(
      `${bundleConfig.src}/assets/**/*`,
      `webapp-build-assets--${bundleName}`
    )

    watchAndRunSequence(
      `${bundleConfig.src}/views/**/*`,
      `webapp-build-views--${bundleName}`
    )
  })

  watchAndRunSequence(
    `${config.paths.vendorScripts}/**/*`,
    'webapp-build-vendor-scripts',
    ...getDependenciesFor('finalScriptsVendorWatch')
  )

  watchAndRunSequence(
    `${config.paths.vendorStyles}/**/*`,
    'webapp-build-vendor-styles',
    ...getDependenciesFor('finalStylesVendorWatch')
  )

  watchAndRunSequence(
    `${config.paths.vendorAssets}/**/*`,
    'webapp-build-vendor-assets',
    ...getDependenciesFor('finalAssetsVendorWatch')
  )

  watchAndRunSequence(
    `${config.paths.vendorViews}/**/*`,
    'webapp-build-vendor-views',
    ...getDependenciesFor('finalAssetsVendorWatch')
  )

  watchAndRunSequence(
    `${config.paths.bowerAssets}/**/*`,
    [
      'webapp-build-bower-assets',
      'webapp-build-bower-scripts',
      'webapp-build-bower-styles',
    ],
    []
      .concat(getDependenciesFor('finalScriptsVendorWatch'))
      .concat(getDependenciesFor('finalStylesVendorWatch'))
      .concat(getDependenciesFor('finalAssetsVendorWatch'))
  )
})

addDependencyToWatch('webapp-build-all')
addDependencyToWatch('webapp-watch')
