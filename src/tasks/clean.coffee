{
  gulp
  rimraf
} = require('../refs').vendor

gulp().task 'webapp-clean', ['parched-clean'], (cb) ->
  rimraf 'public', cb
