import sourcemaps from 'gulp-sourcemaps'
import mainBowerFiles from 'main-bower-files'

import {
  isProduction,
  vendor,
} from '../refs'

import {
  sourcemapsInit,
  sourcemapsWrite,
} from '../pipes/sourcemaps'

vendor.gulp().task('webapp-build-bower-scripts', () => {
  try {
    let bowerFiles = mainBowerFiles({
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

vendor.gulp().task('webapp-build-bower-styles', () => {
  try {
    let bowerFiles = mainBowerFiles({
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

gulp().task('webapp-build-bower-assets', () => {
  try {
    let bowerFiles = mainBowerFiles({
      filter: /^(?!.*(js|css)).*$/
    })
  } catch (error) {
    bowerFiles = []
  }

  return vendor.gulp()
      .src(bowerFiles)
      .pipe(vendor.gulp().dest('public'))
})
