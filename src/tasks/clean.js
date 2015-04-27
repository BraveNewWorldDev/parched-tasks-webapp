import {
  addDependencyToClean,
  vendor,
} from '../refs'

import {
  getConfig,
} from '../ConfigStore'

let config = getConfig()

Object.keys(config.bundles).forEach((bundleName) => {
  (function (bundleName) {
    let bundleConfig = config.bundles[bundleName]
    let taskName = `webapp-clean--${bundleName}`

    vendor.gulp().task(taskName, false, (done) => {
      vendor.rimraf(bundleConfig.dest, done)
    })

    addDependencyToClean(taskName)
  })(bundleName)
})
