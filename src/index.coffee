refs = require('./refs')

module.exports = (Parched) ->
  for own key, value of Parched
    refs[key] = value


  Parched.createPlugin {
    displayName: 'parched-noop-assets'
    src: '*.*'

    shouldProcessAssets: ->
      true

    transform: ->
      @noop()
  }

  Parched.createPlugin {
    displayName: 'parched-javascript'
    src: '*.js'

    transform: ->
      @noop()
  }

  Parched.createPlugin {
    displayName: 'parched-css'
    src: '*.css'

    transform: ->
      @noop()
  }

  { setConfig } = require './config'
  setConfig Parched.getAppConfig().webapp
  require './tasks'
