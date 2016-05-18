import sourcemaps from 'gulp-sourcemaps'

import {
  isProduction,
  vendor,
} from '../refs.js'

const defaults = {}

export default function sourcemapsInit (opts) {
  if (isProduction()) {
    return vendor.gutil.noop()
  } else {
    return sourcemaps.init({
      ...defaults,
      ...opts,
    })
  }
}
