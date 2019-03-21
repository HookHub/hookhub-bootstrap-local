var yaml = require('js-yaml')
var fs = require('fs')
var conf = {}

let BOOTSTRAP_CONFIG = process.env['HOOKHUB_BOOTSTRAP_CONFIG'] ? process.env['HOOKHUB_BOOTSTRAP_CONFIG'] : 'hookhub.yml'

// Sanity check
if (!fs.existsSync(BOOTSTRAP_CONFIG)) {
  throw new Error('Missing bootstrap config')
}

if (fs.accessSync(BOOTSTRAP_CONFIG) !== undefined) {
  throw new Error('Inaccessible bootstrap config')
}

try {
  conf = yaml.safeLoad(fs.readFileSync(BOOTSTRAP_CONFIG, 'utf8'))
  console.log('Loaded bootstrap configuration')
} catch (e) {
  throw new Error(e)
}

function get (confPath) {
  var result = conf // cloning the existing obj

  if (confPath === '/') return conf
  confPath.substring(1).split('/').forEach(function (key) {
    if(result !== null) {
      if (typeof result[key] === 'undefined') {
        result = null
      } else {
        result = result[key]
      }
    }
  })

  return result
}

function getCredentials () {
  return get('/credentials')
}

function getHooks () {
  return get('/hooks')
}

function getPlugins () {
  return get('/plugins')
}

function getResources () {
  return get('/resources')
}

module.exports.get = get
module.exports.getCredentials = getCredentials
module.exports.getHooks = getHooks
module.exports.getPlugins = getPlugins
module.exports.getResources = getResources
