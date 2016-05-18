import sourcemaps from 'gulp-sourcemaps'
import path from 'path'

import {
  isProduction,
  vendor,
} from '../refs.js'

const defaults = {
  _sourceRoot (file) {
    console.log(path.relative(process.cwd(), path.dirname(file.path)))
    return path.relative(process.cwd(), path.dirname(file.path))
  }
}

export default function (opts) {
  if (isProduction()) {
    return vendor.gutil.noop()
  } else {
    return sourcemaps.write({
      ...defaults,
      ...opts,
    })
  }
}

