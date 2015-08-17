import {
  modifyBundleOptions,
  modifyBrowserifyObject,
} from './tasks/build-app-scripts'

export function getAllExtensions () {
  let tmpBundleOptions = {
    extensions: [],
  }

  modifyBundleOptions(tmpBundleOptions)
  return tmpBundleOptions.extensions
}

export let prebundle = modifyBrowserifyObject
