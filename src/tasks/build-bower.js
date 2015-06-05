import sourcemaps from 'gulp-sourcemaps'
import mainBowerFiles from 'main-bower-files'

import sourcemapsInit from '../pipes/sourcemapsInit'
import sourcemapsWrite from '../pipes/sourcemapsWrite'

import {
  getConfig,
} from '../ConfigStore'

import {
  isProduction,
  vendor,
} from '../refs'

import {
  addDependency,
} from '../DependencyStore'

let config = getConfig()

addDependency('scripts', 'webapp-build-bower-scripts')
vendor.gulp().task('webapp-build-bower-scripts', false, () => {
  let bowerFiles
  try {
    bowerFiles = mainBowerFiles({
      filter: /\.js$/
    })
  } catch (error) {
    bowerFiles = []
  }

  return vendor.gulp()
      .src(bowerFiles)
      .pipe(sourcemapsInit())
      .pipe(sourcemapsWrite())
      .pipe(vendor.gulp().dest('tmp/webapp/00-vendor'))
})

addDependency('styles', 'webapp-build-bower-styles')
vendor.gulp().task('webapp-build-bower-styles', false, () => {
  let bowerFiles
  try {
    bowerFiles = mainBowerFiles({
      filter: /\.css/
    })
  } catch (error) {
    bowerFiles = []
  }

  return vendor.gulp()
      .src(bowerFiles)
      .pipe(sourcemapsInit())
      .pipe(sourcemapsWrite())
      .pipe(vendor.gulp().dest('tmp/webapp/00-vendor'))
})

addDependency('assets', 'webapp-build-bower-assets')
vendor.gulp().task('webapp-build-bower-assets', false, () => {
  let bowerFiles
  try {
    bowerFiles = mainBowerFiles({
      filter: /^(?!.*(js|css)).*$/
    })
  } catch (error) {
    bowerFiles = []
  }

  return vendor.gulp()
      .src(bowerFiles, {
        //base: 'bower_components/*'
      })
      // Seems like gulp.dest's `base` option doesn't support something like
      // `bower_components/*`
      .pipe(updateBasePath((file) => {
        // /home/user/project/bower_components/fontawesome/fonts/font.ttf
        //     -> bower_components/fontawesome
        return file.base.replace(/^.*(bower_components\/[^/]+).*$/, '$1')
      }))
      .pipe(vendor.gulp().dest('tmp/webapp/00-vendor'))
})

function updateBasePath (renameFn) {
  function transform (file, enc, done) {
    if (renameFn) {
      file.base = renameFn(file)
    }
    this.push(file)
    done()
  }

  return vendor.through2.obj(transform)
}
