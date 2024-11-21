const pkg = require('./package.json');

module.exports = {
  headers: {
    name: "Omnivox UI Optimizer",
    version: process.env.NODE_ENV === 'development' ? `${pkg.version}-[buildTime]` : pkg.version,
    author: pkg.author,
    description: pkg.description,
    homepage: pkg.homepage,
    match: '*://*.omnivox.ca/*',
    grant: ['GM_addStyle'],
    'run-at': 'document-start',
    updateURL: pkg.homepage + '/releases/latest/download/omnivox-optimizer.meta.js',
    downloadURL: pkg.homepage + '/releases/latest/download/omnivox-optimizer.user.js'
  }
};