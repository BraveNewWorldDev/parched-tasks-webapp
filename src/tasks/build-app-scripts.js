import browserify from 'browserify'
import watchify from 'watchify'
import source from 'vinyl-source-stream'
import buffer from 'vinyl-buffer'
import makeSourcesRelative from '../pipes/makeSourcesRelative'

import {
  getConfig,
} from '../ConfigStore'

import {
  addDependency,
  getDependenciesFor,
} from '../DependencyStore'

let config = getConfig()

import {
  handleErrors,
  getAllInstances,
  combineStreamFromPluginMethod,
  isProduction,
  vendor,
} from '../refs'

let defaultBundleOptions = {
  debug: !isProduction(),
  entries: 'index.js',
  extensions: [],
}

// Returns either a browserify or a watchify stream to be used in a
// gulp task
function makeBrowserifyStream (bundleName) {
  let bundleConfig = config.bundles[bundleName]
  let outputName = `${bundleName}.js`
  let bundleSrc = bundleConfig.src
  let browserifyOptions = vendor.xtend(
    {},
    defaultBundleOptions,
    bundleConfig.browserify,
    global.isWatching ? watchify.args : {}
  )

  let browserifyInstance = createBrowserifyInstance(bundleName, browserifyOptions)
  modifyBrowserifyObject(browserifyInstance)

  if (browserifyOptions.modifyBrowserifyObject) {
    browserifyOptions.modifyBrowserifyObject(browserifyInstance)
  }

  if (global.isWatching) {
    browserifyInstance = watchify(browserifyInstance)
    browserifyInstance.on('update', createBundleFactory(bundleName, browserifyInstance))
  }

  return createBundleFactory(bundleName, browserifyInstance)()
}

function createBrowserifyInstance (bundleName, browserifyOptions) {
  let bundleConfig = config.bundles[bundleName]
  let bundleSrc = bundleConfig.src

  if (!Array.isArray(browserifyOptions.entries)) {
    browserifyOptions.entries = [browserifyOptions.entries]
  }

  // Fill out the paths in `browserifyOptions.entries`
  // TODO support user defined paths
  browserifyOptions.entries = browserifyOptions.entries.map((entry) => {
    return `./${bundleSrc}/scripts/${entry}`
  })

  modifyBundleOptions(browserifyOptions)

  if (browserifyOptions.modifyBundleOptions) {
    browserifyOptions.modifyBundleOptions(browserifyOptions)
  }

  return browserify(browserifyOptions.entries, browserifyOptions)
}

// Returns a function to either be called directly or in
// `browserifyInstance.on('update')`
function createBundleFactory (bundleName, browserifyInstance) {
  let bundleConfig = config.bundles[bundleName]
  let outputName = `${bundleName}.js`

  return () => {
    return browserifyInstance.bundle()
        .on('error', handleErrors)

        // Convert browserify object to streaming vinyl file object
        .pipe(source(outputName))
        // Convert from streaming to buffered vinyl object
        .pipe(buffer())

        .pipe(makeSourcesRelative())
        .pipe(vendor.gulp().dest(`tmp/webapp/99-${bundleName}`))

        .on('end', () => {
          vendor.gutil.log('browserify', `Bundled ${outputName}`)
          if (global.isWatching && hasBuiltOnce) {
            vendor.gulp().start(`webapp-build-final-scripts--${bundleName}`)
          }
        })
  }
}

// Run `modifyBundleOptions` for each plugin
export function modifyBundleOptions (browserifyOptions) {
  getAllInstances().forEach((pluginInstance) => {
    if (pluginInstance.modifyBundleOptions) {
      pluginInstance.modifyBundleOptions(browserifyOptions)
    }
  })

  return browserifyOptions
}

// Run `modifyBrowserifyObject` for each plugin
export function modifyBrowserifyObject (b) {
  getAllInstances().forEach((pluginInstance) => {
    if (pluginInstance.modifyBrowserifyObject) {
      pluginInstance.modifyBrowserifyObject(b)
    }
  })

  return b
}

Object.keys(config.bundles).forEach((bundleName) => {
  (function () {
    let taskName = `webapp-build-browserify--${bundleName}`
    addDependency('browserify', taskName)

    vendor.gulp().task(taskName, false, () => {
      return makeBrowserifyStream(bundleName)
    })
  })(bundleName)
})

// The `webapp-build-app-scripts` task calls the `browserify` tasks if needed
let hasBuiltOnce = false

vendor.gulp().task('webapp-build-browserify', false, (done) => {
  function __done () {
    hasBuiltOnce = true
    done(...arguments)
  }

  // We are in `watch` mode. watchify watches files on its own and we
  // don't need to do anything.
  if (global.isWatching && hasBuiltOnce) {
    return __done()
  }

  return vendor.runSequence(getDependenciesFor('browserify'), __done)
})
