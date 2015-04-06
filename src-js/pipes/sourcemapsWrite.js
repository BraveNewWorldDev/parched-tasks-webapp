import sourcemaps from 'gulp-sourcemaps'

import {
  isProduction,
  vendor,
} from '../refs.js'

export default function () {
  if (isProduction()) {
    return vendor.gutil.noop()
  } else {
    return sourcemaps.write()
  }
}

