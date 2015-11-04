import {
  vendor,
} from './refs'

const defaultConfig = {
  paths: {
    vendorScripts: 'vendor/scripts',
    vendorStyles: 'vendor/styles',
    vendorAssets: 'vendor/assets',
    vendorViews: 'vendor/views',
    bowerAssets: 'bower_components',
    public: 'public'
  },

  files: {
    order: {
      before: [],
      after: [],
    }
  }
}

let appConfig = defaultConfig

export function getConfig () {
  return vendor.xtend({}, appConfig)
}

export function setConfig (config) {
  appConfig = vendor.xtend(true, {}, defaultConfig, config)

  appConfig.bundles = appConfig.bundles || {}

  // If no bundles defined, we assume they want an app bundle
  if (Object.keys(appConfig.bundles).length === 0) {
    appConfig.bundles.app = {
      dest: 'public',
      shouldConcatVendorScripts: false,
      shouldConcatVendorStyles: true,
    }

    // TODO this is for testing
    //appConfig.bundles.admin = {
      //dest: './admin-public',
    //}
  }

  let firstBundleName
  //let anyConcatVendor = false
  let anyCopyVendor = false

  Object.keys(appConfig.bundles).forEach((bundleName) => {
    let bundleConfig = appConfig.bundles[bundleName]
    if (!firstBundleName) {
      firstBundleName = bundleName
    }

    // Set the bundle src to the bundle name if not already set
    if (!bundleConfig.src) {
      bundleConfig.src = bundleName
    }

    if (!bundleConfig.dest) {
      if (bundleName === 'app') {
        bundleConfig.dest = 'public'
      } else {
        bundleConfig.dest = `public/${bundleName}`
      }
    }

    if (bundleConfig.shouldConcatVendor) {
      console.log(`[DEPRECATED] shouldConcatVendor has expanded to shouldConcatVendorScripts and shouldConcatVendorStyles. Please update ${bundleName}`)
    }

    if (bundleConfig.shouldConcatVendorScripts == null) {
      bundleConfig.shouldConcatVendorScripts = false
    }

    if (bundleConfig.shouldConcatVendorStyles == null) {
      bundleConfig.shouldConcatVendorStyles = true
    }

    //if (bundleConfig.shouldConcatVendorScripts || bundleConfig.shouldConcatVendorStyles) {
      //anyConcatVendor = true
    //}

    if (bundleConfig.shouldCopyVendor) {
      anyCopyVendor = true
    }
  })

  if (!anyCopyVendor) {
    appConfig.bundles[firstBundleName].shouldCopyVendor = true
  }

  return appConfig
}
