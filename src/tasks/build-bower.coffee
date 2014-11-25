sourcemaps = require 'gulp-sourcemaps'
mainBowerFiles = require 'main-bower-files'

{
  isProduction
} = require '../refs'

{
  gulp
  gutil
} = require('../refs').vendor


sourcemapsInit = ->
  if isProduction()
    gutil.noop()
  else
    sourcemaps.init(loadMaps: true)


sourcemapsWrite = ->
  if isProduction()
    gutil.noop()
  else
    sourcemaps.write()


gulp().task 'webapp-build-bower-scripts', ->
  try
    bowerFiles = mainBowerFiles filter: /\.js$/
  catch
    bowerFiles = []

  gulp()
    .src bowerFiles
    .pipe sourcemapsInit()
    #.pipe concat('00-bower.js')
    .pipe sourcemapsWrite()
    .pipe gulp().dest('tmp/webapp/00-vendor')
    #.pipe browserSyncReload()


gulp().task 'webapp-build-bower-styles', ->
  try
    bowerFiles = mainBowerFiles filter: /\.css/
  catch
    bowerFiles = []

  gulp()
    .src bowerFiles
    .pipe sourcemapsInit()
    #.pipe concat('00-bower.css')
    .pipe sourcemapsWrite()
    .pipe gulp().dest('tmp/webapp/00-vendor')
    #.pipe browserSyncReload()


gulp().task 'webapp-build-bower-assets', ->
  try
    bowerFiles = mainBowerFiles filter: /^(?!.*(js|css)).*$/
  catch
    bowerFiles = []

  gulp()
    .src bowerFiles
    .pipe gulp().dest('public')
    #.pipe browserSyncReload()
