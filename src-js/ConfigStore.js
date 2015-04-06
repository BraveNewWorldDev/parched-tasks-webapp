import {
  vendor,
} from './refs'

const defaultConfig = {
  paths: {
    appScripts: 'app/scripts',
    appStyles: 'app/styles',
    appAssets: 'app/assets',
    appViews: 'app/views',
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

  appConfig.files.scripts = appConfig.files.scripts || {}
  if (Object.keys(appConfig.files.scripts).length === 0) {
    appConfig.files.scripts['app.js'] = {
      entries: 'index.js'
    }
  }

  return appConfig
}
