import { vendor } from '../refs'

vendor.gulp().task('webapp-clean', ['parched-clean'], (done) => {
  vendor.rimraf('public', done)
})
