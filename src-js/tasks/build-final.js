import concat from 'gulp-concat'

import ConfigStore from '../ConfigStore'
import browserSyncReload from '../pipes/browserSyncReload'

import {
  sourcemapsInit,
  sourcemapsWrite
} from '../pipes/sourcemaps'

import {
  isProduction,
  gulpSort,
  addPluginMethodsToStream,
  vendor,
} from '../refs'

vendor.gulp().task('webapp-build-final-styles', () => {
  let config = ConfigStore.getConfig()
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
      .pipe(vendor.concat('app.css'))
      .pipe(sourcemapsWrite())

  if (isProduction()) {
    stream = addPluginMethodsToStream({
      stream: stream,
      methodNames: ['minify']
    })
  }

  stream
      .pipe(gulp().dest('public'))
      .pipe(browserSyncReload())

  return stream
})

gulp().task('webapp-build-final-scripts', () => {
  let config = ConfigStore.getConfig()
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
      .pipe(gulp().dest('public'))
      .pipe(browserSyncReload())

  return stream
})

