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

    createTask({
      taskName: `webapp-lint-scripts--${bundleName}`,
      src: [
        `${bundleConfig.src}/scripts/**/*`
      ],
      sequence: [
        'lint'
      ],

      beforeEach (stream, callbackContext) {
        return stream
            .pipe(cachedForTaskName(callbackContext));
      },

      afterEach (stream, callbackContext) {
        return stream
            .pipe(rememberForTaskName(callbackContext));
      }
    });

    createTask({
      taskName: `webapp-build-styles--${bundleName}`,
      src: [
        `${bundleConfig.src}/styles/**/*`
      ],
      sequence: [
        ['lint', 'transform']
      ],

      beforeLint (stream, callbackContext) {
        return stream
            .pipe(cachedForTaskName(callbackContext));
      },

      afterLint (stream, callbackContext) {
        return stream
            .pipe(rememberForTaskName(callbackContext));
      },

      beforeTransform (stream) {
        return stream
            .pipe(sourcemapsInit());
      },

      afterTransform (stream, callbackContext) {
        return stream
            .pipe(sourcemapsWrite())
            .pipe(vendor.gulp().dest(`tmp/webapp/99-${bundleName}`));
      }
    });

    createTask({
      taskName: `webapp-build-assets--${bundleName}`,
      shouldProcessAssets: true,
      src: [
        `${bundleConfig.src}/assets/**/*`
      ],
      sequence: [
        'transform'
      ],

      afterTransform (stream) {
        return stream
            .pipe(vendor.gulp().dest(`tmp/webapp/99-${bundleName}`))
            .pipe(browserSyncReload());
      }
    });

    createTask({
      taskName: `webapp-build-views--${bundleName}`,
      src: [
        `${bundleConfig.src}/views/**/*`
      ],
      sequence: [
        ['lint', 'transform']
      ],

      afterTransform (stream) {
        return stream
            .pipe(vendor.gulp().dest(`tmp/webapp/99-${bundleName}`))
            .pipe(browserSyncReload());
      }
    });


  })(bundleName)
})

// TODO Remove `-app` in favor of above
//createTask({
  //taskName: 'webapp-lint-app-scripts',
  //src: [
    //`${config.paths.appScripts}/**/*`
  //],
  //sequence: [
    //'lint'
  //],

  //beforeEach (stream, callbackContext) {
    //return stream
        //.pipe(cachedForTaskName(callbackContext));
  //},

  //afterEach (stream, callbackContext) {
    //return stream
        //.pipe(rememberForTaskName(callbackContext));
  //}
//});

//createTask({
  //taskName: 'webapp-build-app-styles',
  //src: [
    //`${config.paths.appStyles}/**/*`
  //],
  //sequence: [
    //['lint', 'transform']
  //],

  //beforeLint (stream, callbackContext) {
    //return stream
        //.pipe(cachedForTaskName(callbackContext));
  //},

  //afterLint (stream, callbackContext) {
    //return stream
        //.pipe(rememberForTaskName(callbackContext));
  //},

  //beforeTransform (stream) {
    //return stream
        //.pipe(sourcemapsInit());
  //},

  //afterTransform (stream, callbackContext) {
    //return stream
        //.pipe(sourcemapsWrite())
        //.pipe(vendor.gulp().dest('tmp/webapp/99-app'));
  //}
//});

//createTask({
  //taskName: 'webapp-build-app-assets',
  //shouldProcessAssets: true,
  //src: [
    //`${config.paths.appAssets}/**/*`
  //],
  //sequence: [
    //'transform'
  //],

  //afterTransform (stream) {
    //return stream
        //.pipe(vendor.gulp().dest(config.paths.public))
        //.pipe(browserSyncReload());
  //}
//});

//createTask({
  //taskName: 'webapp-build-app-views',
  //src: [
    //`${config.paths.appViews}/**/*`
  //],
  //sequence: [
    //['lint', 'transform']
  //],

  //afterTransform (stream) {
    //return stream
        //.pipe(vendor.gulp().dest(config.paths.public))
        //.pipe(browserSyncReload());
  //}
//});

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
        .pipe(sourcemapsInit());
  },

  beforeEach (stream, callbackContext) {
    return stream
        .pipe(cachedForTaskName(callbackContext));
  },

  afterEach (stream, callbackContext) {
    return stream
        .pipe(rememberForTaskName(callbackContext));
  },

  afterTransform (stream, callbackContext) {
    return stream
        .pipe(sourcemapsWrite())
        .pipe(vendor.gulp().dest('tmp/webapp/00-vendor'));
  }
});

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
        .pipe(sourcemapsInit());
  },

  beforeEach (stream, callbackContext) {
    return stream
        .pipe(cachedForTaskName(callbackContext));
  },

  afterEach (stream, callbackContext) {
    return stream
        .pipe(rememberForTaskName(callbackContext));
  },

  afterTransform (stream, callbackContext) {
    return stream
        .pipe(sourcemapsWrite())
        .pipe(vendor.gulp().dest('tmp/webapp/00-vendor'));
  }
});

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
        .pipe(vendor.gulp().dest(config.paths.public))
        .pipe(browserSyncReload());
  }
});

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
        .pipe(vendor.gulp().dest(config.paths.public))
        .pipe(browserSyncReload());
  }
});
