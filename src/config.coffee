{
  xtend
} = require('./refs').vendor

defaultConfig = {
  files:
    order:
      before: []
      after: []
}

appConfig = defaultConfig

getConfig = ->
  xtend {}, appConfig

setConfig = (config) ->
  appConfig = xtend true, {}, defaultConfig, config

  appConfig.files.scripts ?= {}
  if Object.keys(appConfig.files.scripts).length is 0
    appConfig.files.scripts['app.js'] = {
      entries: 'index.js'
    }

  appConfig

module.exports = {
  getConfig
  setConfig
}
