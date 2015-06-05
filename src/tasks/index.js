import cachedForTaskName from '../pipes/cachedForTaskName'
import rememberForTaskName from '../pipes/rememberForTaskName'
import browserSyncReload from '../pipes/browserSyncReload'
import sourcemapsInit from '../pipes/sourcemapsInit'
import sourcemapsWrite from '../pipes/sourcemapsWrite'

import {
  createTask,
  vendor,
} from '../refs'

import {
  getConfig,
} from '../ConfigStore'

import {
  addDependency,
} from '../DependencyStore'

import './build-bower'
import './build-app-scripts'
import './build-final'
import './build-all'
import './watch'
import './clean'

let config = getConfig()

Object.keys(config.bundles).forEach((bundleName) => {
  (function (bundleName) {
    let bundleConfig = config.bundles[bundleName]
    let taskNameScripts = `webapp-lint-scripts--${bundleName}`
    addDependency('scripts', taskNameScripts)

    createTask({
      taskName: taskNameScripts,
      src: [
        `${bundleConfig.src}/scripts/**/*`
      ],
      sequence: [
        'lint'
      ],

      modifyContext (callbackContext) {
        callbackContext.bundleName = bundleName
        callbackContext.bundleSrc = bundleConfig.src
        callbackContext.bundleDest = bundleConfig.dest
      },

      beforeEach (stream, callbackContext) {
        return stream
            .pipe(cachedForTaskName(callbackContext))
      },

      afterEach (stream, callbackContext) {
        return stream
            .pipe(rememberForTaskName(callbackContext))
      }
    })

    let taskNameStyle = `webapp-build-styles--${bundleName}`
    addDependency('styles', taskNameStyle)

    createTask({
      taskName: taskNameStyle,
      src: [
        `${bundleConfig.src}/styles/**/*`
      ],
      sequence: [
        ['lint', 'transform']
      ],

      modifyContext (callbackContext) {
        callbackContext.bundleName = bundleName
        callbackContext.bundleSrc = bundleConfig.src
        callbackContext.bundleDest = bundleConfig.dest
      },

      beforeLint (stream, callbackContext) {
        return stream
            .pipe(cachedForTaskName(callbackContext))
      },

      afterLint (stream, callbackContext) {
        return stream
            .pipe(rememberForTaskName(callbackContext))
      },

      beforeTransform (stream) {
        return stream
            .pipe(sourcemapsInit())
      },

      afterTransform (stream, callbackContext) {
        return stream
            .pipe(sourcemapsWrite())
            .pipe(vendor.gulp().dest(`tmp/webapp/99-${bundleName}`))
      }
    })

    let taskNameAssets = `webapp-build-assets--${bundleName}`
    addDependency('assets', taskNameAssets)

    createTask({
      taskName: taskNameAssets,
      shouldProcessAssets: true,
      src: [
        `${bundleConfig.src}/assets/**/*`
      ],
      sequence: [
        'transform'
      ],

      modifyContext (callbackContext) {
        callbackContext.bundleName = bundleName
        callbackContext.bundleSrc = bundleConfig.src
        callbackContext.bundleDest = bundleConfig.dest
      },

      afterTransform (stream) {
        return stream
            .pipe(vendor.gulp().dest(bundleConfig.dest))
            .pipe(browserSyncReload())
      }
    })

    let taskNameViews = `webapp-build-views--${bundleName}`
    addDependency('views', taskNameViews)
    createTask({
      taskName: taskNameViews,
      src: [
        `${bundleConfig.src}/views/**/*`
      ],
      sequence: [
        ['lint', 'transform']
      ],

      modifyContext (callbackContext) {
        callbackContext.bundleName = bundleName
        callbackContext.bundleSrc = bundleConfig.src
        callbackContext.bundleDest = bundleConfig.dest
      },

      afterTransform (stream) {
        return stream
            .pipe(vendor.gulp().dest(bundleConfig.dest))
            .pipe(browserSyncReload())
      }
    })


  })(bundleName)
})

addDependency('scripts', 'webapp-build-vendor-scripts')
createTask({
  taskName: 'webapp-build-vendor-scripts',
  src: [
    `${config.paths.vendorScripts}/**/*`
  ],
  sequence: [
    'transform'
  ],

  beforeTransform (stream) {
    return stream
        .pipe(sourcemapsInit())
  },

  beforeEach (stream, callbackContext) {
    return stream
        .pipe(cachedForTaskName(callbackContext))
  },

  afterEach (stream, callbackContext) {
    return stream
        .pipe(rememberForTaskName(callbackContext))
  },

  afterTransform (stream, callbackContext) {
    return stream
        .pipe(sourcemapsWrite())
        .pipe(vendor.gulp().dest('tmp/webapp/00-vendor'))
  }
})

addDependency('styles', 'webapp-build-vendor-styles')
createTask({
  taskName: 'webapp-build-vendor-styles',
  src: [
    `${config.paths.vendorStyles}/**/*`
  ],
  sequence: [
    'transform'
  ],

  beforeTransform (stream) {
    return stream
        .pipe(sourcemapsInit())
  },

  beforeEach (stream, callbackContext) {
    return stream
        .pipe(cachedForTaskName(callbackContext))
  },

  afterEach (stream, callbackContext) {
    return stream
        .pipe(rememberForTaskName(callbackContext))
  },

  afterTransform (stream, callbackContext) {
    return stream
        .pipe(sourcemapsWrite())
        .pipe(vendor.gulp().dest('tmp/webapp/00-vendor'))
  }
})

addDependency('assets', 'webapp-build-vendor-assets')
createTask({
  taskName: 'webapp-build-vendor-assets',
  shouldProcessAssets: true,
  src: [
    `${config.paths.vendorAssets}/**/*`
  ],
  sequence: [
    'transform'
  ],

  afterTransform (stream) {
    return stream
        .pipe(vendor.gulp().dest('tmp/webapp/00-vendor'))
        .pipe(browserSyncReload())
  }
})

addDependency('views', 'webapp-build-vendor-views')
createTask({
  taskName: 'webapp-build-vendor-views',
  src: [
    `${config.paths.vendorViews}/**/*`
  ],
  sequence: [
    'transform'
  ],

  afterTransform (stream) {
    return stream
        .pipe(vendor.gulp().dest('tmp/webapp/00-vendor'))
        .pipe(browserSyncReload())
  }
})
