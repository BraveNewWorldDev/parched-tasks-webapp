import refs from './refs'

export default function (Parched) {
  //console.log(Parched)

  Object.keys(Parched).forEach((key) => {
    refs[key] = Parched[key]
  })

  Parched.createPlugin({
    displayName: 'parched-noop-assets',
    src: '*.*',

    shouldProcessAssets () {
      return true
    },

    transform () {
      return this.noop()
    }
  })

  Parched.createPlugin({
    displayName: 'parched-javascript',
    src: '*.js',

    transform () {
      return this.noop()
    }
  })

  Parched.createPlugin({
    displayName: 'parched-css',
    src: '*.css',

    transform () {
      return this.noop()
    }
  })

  let ConfigStore = require('./ConfigStore')
  ConfigStore.setConfig(Parched.getAppConfig().webapp)

  require('./tasks')
  //console.log(require('./DependencyStore').cloneAll())
  console.log(ConfigStore.getConfig())
  console.log(require('./DependencyStore').cloneAll())
}
