import convert from 'convert-source-map'

import {
  isProduction,
  vendor,
} from '../refs'

export default function sourcemapsRestore () {
  if (isProduction()) {
    return vendor.gutil.noop()
  }
  return vendor.through2.obj(transform)
}

function transform (file, enc, doneTransform) {
  // pass through if file is null or already has a source map
  if (file.isNull() || file.sourceMap) {
    this.push(file);
    return doneTransform();
  }

  if (file.isStream()) {
    return doneTransform(new Error('Streaming not supported'));
  }

  let fileContent = file.contents.toString()
  file.contents = new Buffer(convert.removeComments(fileContent), 'utf8')
  file.sourceMap = convert.fromSource(fileContent).toObject()
  //file.sourceMap.sources = file.sourceMap.sources.map(x => {
    //return `${file.sourceMap.sourceRoot}/${x}`
  //})

  this.push(file)
  doneTransform()
}
