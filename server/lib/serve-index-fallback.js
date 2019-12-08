'use strict'
const path = require('path')
const send = require('koa-send')

module.exports = function () {
  return async (ctx, next) => {
    if (ctx.accepts('html')) {
      await send(ctx, path.join('dist/index.html'))
      await next()
    }
  }
}
