'use strict'
module.exports = function () {
  return async (ctx, next) => {
    try {
      await next()
    } catch (err) {
      if (process.env.NODE_ENV !== 'development') {
        err.expose = false
      }
    }
  }
}
