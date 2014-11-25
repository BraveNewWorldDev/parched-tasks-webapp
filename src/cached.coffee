cached = require 'gulp-cached'

module.exports = (callbackContext) ->
  cached callbackContext.taskNameUnique
