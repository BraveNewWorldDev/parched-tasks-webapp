import cached from 'gulp-cached'

export default function (callbackContext) {
  return cached(callbackContext.taskNameUnique)
}
