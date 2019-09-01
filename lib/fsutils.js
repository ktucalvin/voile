'use strict'
const fs = require('fs')

module.exports = {
  ensureDir (path) {
    return new Promise((resolve, reject) => {
      fs.mkdir(path, err =>
        (err && err.code !== 'EEXIST')
          ? reject(err)
          : resolve()
      )
    })
  },

  createReadStream (path) {
    return new Promise((resolve, reject) => {
      let e = fs.createReadStream(path)
        .on('error', reject)
        .on('ready', () => resolve(e))
    })
  }
}
