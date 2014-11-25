sourcemaps = require 'gulp-sourcemaps'

{
  isProduction
} = require './refs'

{
  gutil
} = require('./refs').vendor


sourcemapsInit = ->
  if isProduction()
    gutil.noop()
  else
    sourcemaps.init(loadMaps: true)


sourcemapsWrite = ->
  if isProduction()
    gutil.noop()
  else
    sourcemaps.write()


module.exports = {
  sourcemapsInit
  sourcemapsWrite
}
