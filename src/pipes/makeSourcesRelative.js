import convert from 'convert-source-map'
import path from 'path'
import {
  vendor,
} from '../refs'

export default function makeSourcesRelative () {
  return vendor.through2.obj(function (file, enc, done) {
    const fileContent = file.contents.toString()
    const contentsWithoutMap = convert.removeComments(fileContent)
    const sourcemap = convert.fromSource(fileContent)

    if (!sourcemap) {
      this.push(file)
      done()
      return
    }

    sourcemap.setProperty(
      'sources',
      sourcemap.getProperty('sources')
          .map(x => path.relative(process.cwd(), x))
    )

    file.contents = new Buffer(
      contentsWithoutMap + sourcemap.toComment(),
      'utf8'
    )
    this.push(file)
    done()
  })
}
