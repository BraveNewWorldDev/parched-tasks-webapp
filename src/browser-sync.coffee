browserSync = require 'browser-sync'

{
  gutil
} = require('./refs').vendor


browserSyncReload = ->
  if global.isWatching
    browserSync.reload stream: true
  else
    gutil.noop()


module.exports = {
  browserSyncReload
}
