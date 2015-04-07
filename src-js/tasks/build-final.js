import concat from 'gulp-concat'

import ConfigStore from '../ConfigStore'
import browserSyncReload from '../pipes/browserSyncReload'
import sourcemapsInit from '../pipes/sourcemapsInit'
import sourcemapsWrite from '../pipes/sourcemapsWrite'

import {
  getConfig,
} from '../ConfigStore'

import {
  isProduction,
  gulpSort,
  addPluginMethodsToStream,
  vendor,
} from '../refs'

let config = getConfig()

// Take all .css files and join them to app.css in the public folder
// Run them through minify if isProduction
// Sort via config.files.order.before
//
// TODO allow the files to be defined by the user, like Brunch
vendor.gulp().task('webapp-build-final-styles', false, () => {
  let stream = vendor.gulp()
      .src([
        'tmp/webapp/00-**/*.css',
        'tmp/webapp/99-**/*.css',
      ])

      .pipe(gulpSort({
        before: config.files.order.before,
        after: config.files.order.after
      }))

      .pipe(sourcemapsInit())
      .pipe(concat('app.css'))
      .pipe(sourcemapsWrite())

  if (isProduction()) {
    stream = addPluginMethodsToStream({
      stream: stream,
      methodNames: ['minify']
    })
  }

  stream
      .pipe(vendor.gulp().dest(config.paths.public))
      .pipe(browserSyncReload())

  return stream
})

// Take all .js files and join them to app.js in the public folder
// Run them through minify if isProduction
// Sort via config.files.order.before
//
// TODO While this is nice it has a few issues:
// - two browserify bundles joined just doesn't seem to work
// - joining bower and vendor maybe makes the task take too long
// - splitting to vendor.js and user-defined bundles makes more sense
vendor.gulp().task('webapp-build-final-scripts', false, () => {
  let stream = vendor.gulp()
      .src([
        'tmp/webapp/00-**/*.js',
        'tmp/webapp/99-**/*.js'
      ])
      .pipe(gulpSort({
        before: config.files.order.before,
        after: config.files.order.after
      }))
      .pipe(sourcemapsInit())
      .pipe(concat('app.js'))
      .pipe(sourcemapsWrite())

  if (isProduction()) {
    stream = addPluginMethodsToStream({
      stream: stream,
      methodNames: ['minify']
    })
  }

  stream
      .pipe(vendor.gulp().dest(config.paths.public))
      .pipe(browserSyncReload())

  return stream
})

