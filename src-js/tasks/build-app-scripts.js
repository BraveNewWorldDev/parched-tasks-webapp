import browserify from 'browserify'
import watchify from 'watchify'
import source from 'vinyl-source-stream'
import buffer from 'vinyl-buffer'

import sourcemapsInit from '../pipes/sourcemapsInit'
import sourcemapsWrite from '../pipes/sourcemapsWrite'

import {
  getConfig,
} from '../ConfigStore'

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
function makeBrowserifyTask (outputName, bundleOptions) {
  let browserifyInstance = createBrowserifyInstance(bundleOptions)
  modifyBrowserifyObject(browserifyInstance)

  if (bundleOptions.modifyBrowserifyObject) {
    bundleOptions.modifyBrowserifyObject(browserifyInstance)
  }

  if (global.isWatching) {
    browserifyInstance = watchify(browserifyInstance)
    // TODO this used to be outside of this if block but it makes more sense
    // to apply only when in watch mode
    browserifyInstance.on('update', createBundleFactory(outputName, browserifyInstance))
  }

  return createBundleFactory(outputName, browserifyInstance)()
}

function createBrowserifyInstance (bundleOptions) {
  if (!Array.isArray(bundleOptions.entries)) {
    bundleOptions.entries = [bundleOptions.entries]
  }

  // Fill out the paths in `bundleOptions.entries`
  // TODO support user defined paths
  bundleOptions.entries = bundleOptions.entries.map((entry) => {
    return `./${config.paths.appScripts}/${entry}`
  })

  modifyBundleOptions(bundleOptions)

  if (bundleOptions.modifyBundleOptions) {
    bundleOptions.modifyBundleOptions(bundleOptions)
  }

  return browserify(bundleOptions.entries, bundleOptions)
}

// Returns a function to either be called directly or in
// `browserifyInstance.on('update')`
function createBundleFactory (outputName, browserifyInstance) {
  return () => {
    return browserifyInstance.bundle()
        .on('error', handleErrors)

        // Convert browserify object to streaming vinyl file object
        .pipe(source(outputName))
        // Convert from streaming to buffered vinyl object
        .pipe(buffer())

        .pipe(sourcemapsInit())
        .pipe(sourcemapsWrite())
        .pipe(vendor.gulp().dest('tmp/webapp/99-app'))

        .on('end', () => {
          vendor.gutil.log('browserify', `Bundled ${outputName}`)
          if (global.isWatching && hasBuiltOnce) {
            vendor.gulp().start('webapp-build-final-scripts')
          }
        })
  }
}

// Run `modifyBundleOptions` for each plugin
export function modifyBundleOptions (bundleOptions) {
  getAllInstances().forEach((pluginInstance) => {
    if (pluginInstance.modifyBundleOptions) {
      pluginInstance.modifyBundleOptions(bundleOptions)
    }
  })

  return bundleOptions
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

// Each property in `config.files.scripts` gets its own gulp task
// ie: `webapp-build-app-scripts--index.js`
// They get added as dependencies to the `webapp-build-app-scripts-proxy` task
let proxyTasks = []
let appScripts = config.files.scripts

Object.keys(appScripts).forEach((outputName) => {
  let bundleOptions = appScripts[outputName]
  createGulpProxyTask(outputName, bundleOptions)
})

function createGulpProxyTask (outputName, bundleOptions) {
  let taskName = `webapp-build-app-scripts--${outputName}`
  proxyTasks.push(taskName)

  vendor.gulp().task(taskName, false, () => {
    let watchifyArgs = global.isWatching ? watchify.args : {}
    let optionsClone = vendor.xtend({}, defaultBundleOptions, bundleOptions, watchifyArgs)
    return makeBrowserifyTask(outputName, optionsClone)
  })
}

vendor.gulp().task('webapp-build-app-scripts-proxy', false, proxyTasks)

// The `webapp-build-app-scripts` task calls the `-proxy` task if needed
let hasBuiltOnce = false

vendor.gulp().task('webapp-build-app-scripts', false, (done) => {
  function __done () {
    hasBuiltOnce = true
    done(...arguments)
  }

  // We are in `watch` mode. watchify watches files on its own and we
  // don't need to do anything.
  if (global.isWatching && hasBuiltOnce) {
    return __done()
  }

  return vendor.runSequence('webapp-build-app-scripts-proxy', __done)
})
