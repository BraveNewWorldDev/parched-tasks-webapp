import { vendor } from '../refs'

import {
  getConfig,
} from '../ConfigStore'

let config = getConfig()

vendor.gulp().task('webapp-clean', ['parched-clean'], (done) => {
  vendor.rimraf(config.paths.public, done)
})
