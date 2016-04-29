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

import {
  addDependency,
  getDependenciesFor,
} from '../DependencyStore'

let config = getConfig()

function buildFinalStylesForBundle (bundleName) {
  let bundleConfig = config.bundles[bundleName]
  let taskName = `webapp-build-final-styles--${bundleName}`
  addDependency('finalStyles', taskName)

  if (bundleConfig.shouldConcatVendorStyles) {
    addDependency('finalStylesVendorWatch', taskName)
  }

  vendor.gulp().task(taskName, false, () => {
    let src = []
    if (bundleConfig.shouldConcatVendorStyles) {
      src.push('tmp/webapp/00-vendor/**/*.css')
    }

    src.push(`tmp/webapp/99-${bundleName}/**/*.css`)

    let stream = vendor.gulp()
        .src(src)

        .pipe(gulpSort({
          before: config.files.order.before,
          after: config.files.order.after,
        }))

        .pipe(bundleConfig.shouldConcatVendorStyles ? sourcemapsInit() : vendor.gutil.noop())
        .pipe(concat(`${bundleName}.css`))
        .pipe(bundleConfig.shouldConcatVendorStyles ? sourcemapsWrite() : vendor.gutil.noop())

    if (isProduction()) {
      stream = addPluginMethodsToStream({
        stream,
        methodNames: ['minify']
      })
    }

    stream
        .pipe(vendor.gulp().dest(bundleConfig.dest))
        .pipe(browserSyncReload())

    return stream
  })
}

function buildFinalScriptsForBundle (bundleName) {
  let bundleConfig = config.bundles[bundleName]
  let taskName = `webapp-build-final-scripts--${bundleName}`
  addDependency('finalScripts', taskName)

  if (bundleConfig.shouldConcatVendorScripts) {
    addDependency('finalScriptsVendorWatch', taskName)
  }

  vendor.gulp().task(taskName, false, () => {
    let src = []
    if (bundleConfig.shouldConcatVendorScripts) {
      src.push('tmp/webapp/00-vendor/**/*.js')
    }

    src.push(`tmp/webapp/99-${bundleName}/**/*.js`)

    let stream = vendor.gulp()
        .src(src)

        .pipe(gulpSort({
          before: config.files.order.before,
          after: config.files.order.after,
        }))

        // If the bundle is not concating vendor then we can skip
        // an extra sourcemaps run and shave off time.
        .pipe(bundleConfig.shouldConcatVendorScripts ? sourcemapsInit() : vendor.gutil.noop())
        .pipe(concat(`${bundleName}.js`))
        .pipe(bundleConfig.shouldConcatVendorScripts ? sourcemapsWrite() : vendor.gutil.noop())

    if (isProduction()) {
      stream = addPluginMethodsToStream({
        stream,
        methodNames: ['minify']
      })
    }

    stream
        .pipe(vendor.gulp().dest(bundleConfig.dest))
        .pipe(bundleConfig.hasHMR ? vendor.gutil.noop() : browserSyncReload())

    return stream
  })
}

function buildFinalStylesVendor (bundleName) {
  let bundleConfig = config.bundles[bundleName]
  if (!bundleConfig.shouldCopyVendor) {
    return
  }

  if (bundleConfig.shouldConcatVendorStyles) {
    return
  }

  let taskName = `webapp-build-final-styles-vendor--${bundleName}`
  addDependency('finalStyles', taskName)
  addDependency('finalStylesVendorWatch', taskName)

  vendor.gulp().task(taskName, false, () => {
    let stream = vendor.gulp()
        .src([
          'tmp/webapp/00-vendor/**/*.css'
        ])

        .pipe(gulpSort({
          before: config.files.order.before,
          after: config.files.order.after,
        }))

        .pipe(sourcemapsInit())
        .pipe(concat('vendor.css'))
        .pipe(sourcemapsWrite())

    if (isProduction()) {
      stream = addPluginMethodsToStream({
        stream,
        methodNames: ['minify']
      })
    }

    stream
        .pipe(vendor.gulp().dest(bundleConfig.dest))
        .pipe(browserSyncReload())

    return stream
  })

}

function buildFinalScriptsVendor (bundleName) {
  let bundleConfig = config.bundles[bundleName]
  if (!bundleConfig.shouldCopyVendor) {
    return
  }

  if (bundleConfig.shouldConcatVendorScripts) {
    return
  }

  let taskName = `webapp-build-final-scripts-vendor--${bundleName}`
  addDependency('finalScripts', taskName)
  addDependency('finalScriptsVendorWatch', taskName)

  vendor.gulp().task(taskName, false, () => {
    let stream = vendor.gulp()
        .src([
          'tmp/webapp/00-vendor/**/*.js'
        ])

        .pipe(gulpSort({
          before: config.files.order.before,
          after: config.files.order.after,
        }))

        .pipe(sourcemapsInit())
        .pipe(concat('vendor.js'))
        .pipe(sourcemapsWrite())

    if (isProduction()) {
      stream = addPluginMethodsToStream({
        stream,
        methodNames: ['minify']
      })
    }

    stream
        .pipe(vendor.gulp().dest(bundleConfig.dest))
        .pipe(browserSyncReload())

    return stream
  })

}

function buildFinalAssetsVendor (bundleName) {
  let bundleConfig = config.bundles[bundleName]
  if (!bundleConfig.shouldCopyVendor) {
    return
  }

  let taskName = `webapp-build-final-assets-vendor--${bundleName}`
  addDependency('finalAssets', taskName)
  addDependency('finalAssetsVendorWatch', taskName)

  vendor.gulp().task(taskName, false, () => {
    let stream = vendor.gulp()
        .src([
          'tmp/webapp/00-vendor/**/*',
          '!**/*.js',
          '!**/*.css'
        ])
        .pipe(vendor.gulp().dest(bundleConfig.dest))
        .pipe(browserSyncReload())

    return stream
  })

}

Object.keys(config.bundles).forEach((bundleName) => {
  buildFinalStylesForBundle(bundleName)
  buildFinalScriptsForBundle(bundleName)
  buildFinalStylesVendor(bundleName)
  buildFinalScriptsVendor(bundleName)
  buildFinalAssetsVendor(bundleName)
})
