{
  modifyBundleOptions
  modifyBrowserifyObject
} = require './tasks/build-app-scripts'


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
