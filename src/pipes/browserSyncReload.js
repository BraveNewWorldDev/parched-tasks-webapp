import browserSyncInstance from '../browserSyncInstance'
import { vendor } from '../refs'

export default function () {
  if (global.isWatching) {
    return browserSyncInstance.reload({
      stream: true,
    })
  } else {
    return vendor.gutil.noop()
  }
}
