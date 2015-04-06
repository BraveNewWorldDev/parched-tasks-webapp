import sourcemaps from 'gulp-sourcemaps'

import {
  isProduction,
  vendor,
} from '../refs.js'

export default function sourcemapsInit () {
  if (isProduction()) {
    return vendor.gutil.noop()
  } else {
    return sourcemaps.init({
      loadMaps: true,
    })
  }
}
