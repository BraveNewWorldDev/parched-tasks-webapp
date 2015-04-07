import browserSync from 'browser-sync'
import { vendor } from '../refs'

export default function () {
  if (global.isWatching) {
    return browserSync.reload({
      stream: true,
    })
  } else {
    return vendor.gutil.noop()
  }
}
