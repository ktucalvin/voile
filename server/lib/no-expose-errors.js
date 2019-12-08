'use strict'
module.exports = function () {
  return async (ctx, next) => {
    try {
      await next()
    } catch (err) {
      err.expose = false
    }
  }
}
