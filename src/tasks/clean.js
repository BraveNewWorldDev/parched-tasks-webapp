import {
  addDependencyToClean,
  vendor,
} from '../refs'

import {
  getConfig,
} from '../ConfigStore'

let config = getConfig()

vendor.gulp().task('webapp-clean', false, (done) => {
  vendor.rimraf(config.paths.public, done)
})

addDependencyToClean('webapp-clean')
