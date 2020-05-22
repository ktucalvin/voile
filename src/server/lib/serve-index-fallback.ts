import path from 'path'
import send from 'koa-send'
import { Context, Next } from 'koa'

export function serveIndexFallback () {
  return async (ctx: Context, next: Next) => {
    if (ctx.accepts('html')) {
      await send(ctx, path.join('dist/client/index.html'))
      await next()
    }
  }
}
