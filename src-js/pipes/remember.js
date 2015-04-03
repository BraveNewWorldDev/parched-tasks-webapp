import remember from 'gulp-remember'

export default function (callbackContext) {
  return remember(callbackContext.taskNameUnique)
}
