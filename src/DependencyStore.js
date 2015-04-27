//export default {
  //scripts: [],
  //styles: [],
  //views: [],
  //assets: [],
  //finalScripts: [],
  //finalStyles: [],
  //finalViews: [],
  //finalAssets: [],
//}

let cache = {}

export function addDependency (key, ...dependencies) {
  if (!cache[key]) {
    cache[key] = []
  }

  dependencies.forEach((name) => {
    if (!name) {
      return
    }

    cache[key] = cache[key].concat(name)
  })
}

export function getDependenciesFor (key) {
  if (!cache[key]) {
    return []
  }

  return [].concat(cache[key])
}

export function cloneAll () {
  let { xtend } = require('./refs').vendor

  return xtend({}, cache)
}

//import {
  //vendor,
//} from './refs'

//let dependencyCache = {
  //scripts: [],
  //styles: [],
  //assets: [],
  //finalScripts: [],
  //finalStyles: [],
  //finalAssets: [],
//}

//// Scripts
//export function addDependencyToScripts (taskName) {
  //if (!taskName) {
    //return
  //}

  //dependencyCache.scripts = dependencyCache.scripts.concat(taskName)
//}

//export function getDependenciesForScripts () {
  //return [].concat(dependencyCache.scripts)
//}

//// Styles
//export function addDependencyToStyles (taskName) {
  //if (!taskName) {
    //return
  //}

  //dependencyCache.styles = dependencyCache.styles.concat(taskName)
//}

//export function getDependenciesForStyles () {
  //return [].concat(dependencyCache.styles)
//}

//// Assets
//export function addDependencyToAssets (taskName) {
  //if (!taskName) {
    //return
  //}

  //dependencyCache.assets = dependencyCache.assets.concat(taskName)
//}

//export function getDependenciesForAssets () {
  //return [].concat(dependencyCache.assets)
//}

//// FinalScripts
//export function addDependencyToFinalScripts (taskName) {
  //if (!taskName) {
    //return
  //}

  //dependencyCache.finalScripts = dependencyCache.finalScripts.concat(taskName)
//}

//export function getDependenciesForFinalScripts () {
  //return [].concat(dependencyCache.finalScripts)
//}

//// FinalStyles
//export function addDependencyToFinalStyles (taskName) {
  //if (!taskName) {
    //return
  //}

  //dependencyCache.finalStyles = dependencyCache.finalStyles.concat(taskName)
//}

//export function getDependenciesForFinalStyles () {
  //return [].concat(dependencyCache.finalStyles)
//}

//// FinalAssets
//export function addDependencyToFinalAssets (taskName) {
  //if (!taskName) {
    //return
  //}

  //dependencyCache.finalAssets = dependencyCache.finalAssets.concat(taskName)
//}

//export function getDependenciesForFinalAssets () {
  //return [].concat(dependencyCache.finalAssets)
//}

//export function cloneAll () {
  //return vendor.xtend({}, dependencyCache)
//}
