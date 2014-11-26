{
  modifyBundleOptions
  modifyBrowserifyObject
} = require './tasks/build-app-scripts.coffee'


getAllExtensions = ->
  bundleOptions = {
    extensions: []
  }
  modifyBundleOptions bundleOptions
  bundleOptions.extensions


module.exports = {
  getAllExtensions
  prebundle: modifyBrowserifyObject
}
