browserify = require 'browserify'
watchify = require 'watchify'
source = require 'vinyl-source-stream'
buffer = require 'vinyl-buffer'
sourcemaps = require 'gulp-sourcemaps'

{
  handleErrors
  vendor
  getAllInstances
  combineStreamFromPluginMethod
  gulp
  isProduction
} = require '../refs'

{
  getConfig
} = require '../config'

defaultBundleOptions = {
  debug: !isProduction()
  entries: 'index.js'
  extensions: []
}


makeBrowserifyTask = (outputName, bundleOptions) ->
  bundler = createBrowserifyInstance bundleOptions
  modifyBrowserifyObject bundler
  bundleOptions.modifyBrowserifyObject? bundler

  if global.isWatching
    bundler = watchify bundler

  bundler.on 'update', runBundleFor(outputName, bundler)
  runBundleFor(outputName, bundler)()


createBrowserifyInstance = (bundleOptions) ->
  if !Array.isArray bundleOptions.entries
    bundleOptions.entries = [bundleOptions.entries]

  for entry, i in bundleOptions.entries
    bundleOptions.entries[i] = "./app/scripts/#{entry}"

  modifyBundleOptions bundleOptions
  bundleOptions.modifyBundleOptions? bundleOptions
  browserify bundleOptions.entries, bundleOptions


runBundleFor = (outputName, bundler) -> ->
  bundler.bundle()
    .on 'error', handleErrors

    # Convert browserify object to streaming vinyl file object
    .pipe source(outputName)

    # Convert from streaming to buffered vinyl object
    .pipe buffer()

    .pipe sourcemaps.init(loadMaps: true)
    .pipe sourcemaps.write()
    .pipe gulp().dest('tmp/webapp/99-app')

    #.on 'readable', ->
      #if global.isWatching and hasBuiltOnce
        #gulp().start 'webapp-lint-app-scripts'

    .on 'end', ->
      vendor.gutil.log 'browserify', "Bundled #{outputName}"

      if global.isWatching and hasBuiltOnce
        gulp().start 'webapp-build-final-scripts'


modifyBundleOptions = (bundleOptions) ->
  for pluginInstance in getAllInstances()
    pluginInstance.modifyBundleOptions? bundleOptions

  undefined


modifyBrowserifyObject = (b) ->
  for pluginInstance in getAllInstances()
    pluginInstance.modifyBrowserifyObject? b

  undefined


hasBuiltOnce = false
proxyTasks = []


for outputName, bundleOptions of getConfig().files.scripts
  do (outputName, bundleOptions) ->
    taskName = "webapp-build-app-scripts--#{outputName}"
    proxyTasks.push taskName

    gulp().task taskName, ->
      watchifyArgs = if global.isWatching
        watchify.args
      else
        {}

      optionsClone = vendor.xtend {},
        defaultBundleOptions
        bundleOptions
        watchifyArgs

      makeBrowserifyTask outputName, optionsClone


gulp().task 'webapp-build-app-scripts-proxy', proxyTasks


gulp().task 'webapp-build-app-scripts', (cb) ->
  __cb = ->
    hasBuiltOnce = true
    cb arguments...

  if global.isWatching and hasBuiltOnce
    return __cb()

  vendor.runSequence 'webapp-build-app-scripts-proxy', __cb
