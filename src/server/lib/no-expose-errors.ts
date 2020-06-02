import { Context, Next } from 'koa'
export function noExposeErrors () {
  return async (_unusedCtx: Context, next: Next) => {
    try {
      await next()
    } catch (err) {
      if (process.env.NODE_ENV !== 'development') {
        err.expose = false
      }
      console.log(err)
    }
  }
}
