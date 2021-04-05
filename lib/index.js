let dynamicImport
try {
  dynamicImport = require('./esm').dynamicImport
} catch (_err) {
  // Ignore since syntax is not supported in this environment
}

function onError (err) {
  throw err /* ↓ Check stack trace ↓ */
}

module.exports = function (filename, opts) {
  require('../dist/v8cache')
  const jiti = require('../dist/jiti')

  opts = { dynamicImport, onError, ...opts }

  if (!opts.transform) {
    const tsNode = require('../dist/tsc')
    const babel = require('../dist/babel')
    opts.transform = function (opts) {
      return tsNode(opts) || babel(opts)
    }
  }

  return jiti(filename, opts)
}
