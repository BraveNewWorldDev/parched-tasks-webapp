import sourcemaps from 'gulp-sourcemaps'
import mainBowerFiles from 'main-bower-files'

import sourcemapsInit from '../pipes/sourcemapsInit'
import sourcemapsWrite from '../pipes/sourcemapsWrite'

import {
  getConfig,
} from '../ConfigStore'

import {
  isProduction,
  vendor,
} from '../refs'

import {
  addDependency,
} from '../DependencyStore'

let config = getConfig()

addDependency('scripts', 'webapp-build-bower-scripts')
vendor.gulp().task('webapp-build-bower-scripts', false, () => {
  let bowerFiles
  try {
    bowerFiles = mainBowerFiles({
      filter: /\.js$/
    })
  } catch (error) {
    bowerFiles = []
  }

  return vendor.gulp()
      .src(bowerFiles)
      .pipe(sourcemapsInit())
      .pipe(sourcemapsWrite())
      .pipe(vendor.gulp().dest('tmp/webapp/00-vendor'))
})

addDependency('styles', 'webapp-build-bower-styles')
vendor.gulp().task('webapp-build-bower-styles', false, () => {
  let bowerFiles
  try {
    bowerFiles = mainBowerFiles({
      filter: /\.css/
    })
  } catch (error) {
    bowerFiles = []
  }

  return vendor.gulp()
      .src(bowerFiles)
      .pipe(sourcemapsInit())
      .pipe(sourcemapsWrite())
      .pipe(vendor.gulp().dest('tmp/webapp/00-vendor'))
})

addDependency('assets', 'webapp-build-bower-assets')
vendor.gulp().task('webapp-build-bower-assets', false, () => {
  let bowerFiles
  try {
    bowerFiles = mainBowerFiles({
      filter: /^(?!.*(js|css)).*$/
    })
  } catch (error) {
    bowerFiles = []
  }

  return vendor.gulp()
      .src(bowerFiles)
      .pipe(vendor.gulp().dest(config.paths.public))
})
