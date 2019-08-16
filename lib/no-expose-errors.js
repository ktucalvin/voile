'use strict'
module.exports = async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    err.expose = false
  }
}
