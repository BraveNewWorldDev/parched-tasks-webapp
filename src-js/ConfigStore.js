import { xtend } from './refs'

const defaultConfig = {
  files: {
    order: {
      before: [],
      after: [],
    }
  }
}

let appConfig = defaultConfig

export function getConfig () {
  return xtend({}, appConfig)
}

export function setConfig (config) {
  appConfig = xtend(true, {}, defaultConfig, config)

  appConfig.files.scripts = appConfig.files.scripts || {}
  if (Object.keys(appConfig.files.scripts).length === 0) {
    appConfig.files.scripts['app.js'] = {
      entries: 'index.js'
    }
  }

  return appConfig
}
