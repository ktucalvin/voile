/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["expect", "expectStatusCode"] }] */
import { promises as fsp } from 'fs'
import { Context } from 'koa'
import send from 'koa-send'
import { createMockContext } from '@shopify/jest-koa-mocks'
import { createTestDatabase } from '../../lib/mock-db'
import { FsUtils } from '../../lib/fsutils'
import { resizeImage, setCacheSubDirectory } from '../image'

const sharpMock = {
  resize: jest.fn(() => sharpMock),
  clone: jest.fn(() => sharpMock),
  png: jest.fn(() => sharpMock),
  jpeg: jest.fn(() => sharpMock),
  webp: jest.fn(() => sharpMock),
  toFile: jest.fn(() => sharpMock)
}

jest.mock('koa-send')
jest.mock('sharp', () => () => sharpMock)

let ctx: Context, validCtx: Context

const dbName = 'test'

async function expectStatusCode (code: number) {
  await resizeImage(ctx)
  expect(ctx.status).toEqual(code)
}

function setReaddirReturn (retval: any[]) {
  jest.spyOn(fsp, 'readdir')
    .mockImplementation(() => new Promise(resolve => resolve(retval)))
}

async function testSharpOutput (assertionFn: () => void) {
  // fake inability to serve cached file
  jest.spyOn(FsUtils, 'createReadStream')
    .mockImplementation(() => { throw new Error() })

  setReaddirReturn(['1.png'])
  await resizeImage(ctx)
  assertionFn()
}

describe('GET /api/img/:gallery/:chapter/:page', function () {
  beforeAll(async function () {
    await createTestDatabase()
    setCacheSubDirectory('test')
  })

  beforeEach(function () {
    ctx = createMockContext({
      customProperties: {
        params: {}
      }
    })
    validCtx = createMockContext({
      customProperties: {
        params: {
          gallery: 'TEST',
          chapter: '1',
          page: '1'
        },
        request: {
          query: { w: '50' }
        },
        set: jest.fn()
      }
    })

    // do not actually touch file system
    jest.spyOn(FsUtils, 'ensureDir')
      .mockImplementation(() => new Promise(resolve => resolve()))
  })

  afterEach(function () {
    jest.clearAllMocks()
  })

  describe('responds with 400 when', function () {
    it('does not receive gallery id', async function () {
      ctx.params.page = '1'
      ctx.params.chapter = '1'
      await expectStatusCode(400)
    })

    it('does not receive chapter number', async function () {
      ctx.params.gallery = 'TEST'
      ctx.params.page = '1'
      await expectStatusCode(400)
    })

    it('does not receive page number', async function () {
      ctx.params.gallery = 'TEST'
      ctx.params.chapter = '1'
      await expectStatusCode(400)
    })

    it('does not receive width', async function () {
      ctx.params.gallery = 'TEST'
      ctx.params.chapter = '1'
      ctx.params.page = '1'
      await expectStatusCode(400)
    })

    it('given non-numeric page', async function () {
      ctx.params.page = 'string'
      await expectStatusCode(400)
    })

    it('given non-float chapter', async function () {
      ctx.params.gallery = 'TEST'
      ctx.params.chapter = 'not a float'
      ctx.params.page = '1'
      await expectStatusCode(400)
    })

    it('given non-numeric width', async function () {
      ctx.params.gallery = 'TEST'
      ctx.params.chapter = '1'
      ctx.params.page = '1'
      ctx.request.query.w = 'string'
      await expectStatusCode(400)
    })

    it('given non-numeric height', async function () {
      Object.assign(ctx, validCtx)
      ctx.request.query.h = 'string'
      await expectStatusCode(400)
    })

    it('given width less than 1', async function () {
      ctx.params.page = '1'
      ctx.params.gallery = 'TEST'
      ctx.request.query.w = '-5'
      await expectStatusCode(400)
    })

    it('given height less than 1', async function () {
      Object.assign(ctx, validCtx)
      ctx.request.query.h = '-5'
      await expectStatusCode(400)
    })

    it('given width over 2048', async function () {
      ctx.params.gallery = 'TEST'
      ctx.params.chapter = '1'
      ctx.params.page = '1'
      ctx.request.query.w = '2049'
      await expectStatusCode(400)
    })

    it('given height over 2048', async function () {
      ctx.params.page = '1'
      ctx.params.gallery = 'TEST'
      ctx.request.query.w = '50'
      ctx.request.query.h = '2049'
      await expectStatusCode(400)
    })

    it('given invalid fit', async function () {
      Object.assign(ctx, validCtx)
      ctx.request.query.fit = 'invalid'
      await expectStatusCode(400)
    })

    it('given invalid format', async function () {
      Object.assign(ctx, validCtx)
      ctx.request.query.format = 'invalid'
      await expectStatusCode(400)
    })
  }) // End of simple ctx validation

  it('responds with 404 if gallery doesn\'t exist', async function () {
    jest.spyOn(FsUtils, 'createReadStream').mockImplementation(() => { throw new Error() })
    Object.assign(ctx, validCtx)
    await expectStatusCode(404)
  })

  it('responds with 404 if page doesn\'t exist', async function () {
    setReaddirReturn(['1'])
    Object.assign(ctx, validCtx)
    ctx.params.page = '7'
    await expectStatusCode(404)
  })

  it('sends original image if it cannot be resized', async function () {
    setReaddirReturn(['1.gif'])
    Object.assign(ctx, validCtx)
    ctx.params.page = '1'
    await resizeImage(ctx)
    expect(send as jest.Mock).toHaveBeenCalled()
  })

  it('replaces jpg with jpeg', async function () {
    setReaddirReturn(['1.png'])
    Object.assign(ctx, validCtx)
    ctx.request.query.format = 'jpg'
    await resizeImage(ctx)
    expect(ctx.set as jest.Mock).toHaveBeenCalledWith('Content-Type', 'image/jpeg')
  })

  it('serves cached file if it exists', async function () {
    setReaddirReturn(['1.png'])
    jest.spyOn(FsUtils, 'createReadStream').mockImplementation(() => 'test passed' as any)
    Object.assign(ctx, validCtx)
    await resizeImage(ctx)
    expect(ctx.body).toEqual('test passed')
    expect(FsUtils.createReadStream).toBeCalledWith(`imgcache/${dbName}/TEST-C1P1-50.webp`)
  })

  it('writes optional information in cached filename', async function () {
    setReaddirReturn(['1.png', '2.png'])
    jest.spyOn(FsUtils, 'createReadStream')
    Object.assign(ctx, validCtx)
    ctx.request.query.h = '50'
    ctx.request.query.fit = 'fill'
    ctx.request.query.format = 'png'
    await resizeImage(ctx)
    expect(FsUtils.createReadStream).toBeCalledWith(`imgcache/${dbName}/TEST-C1P1-50x50-fill.png`)
  })

  it('resizes image given only width', async function () {
    Object.assign(ctx, validCtx)
    await testSharpOutput(() => {
      expect(sharpMock.resize as jest.Mock).toBeCalledWith(50)
    })
  })

  it('resizes image given width and height', async function () {
    Object.assign(ctx, validCtx)
    ctx.request.query.h = '150'
    await testSharpOutput(() => {
      expect(sharpMock.resize).toBeCalledWith(50, 150, { fit: 'cover' })
    })
  })

  it('resizes image given width, height, and fit', async function () {
    Object.assign(ctx, validCtx)
    ctx.request.query.h = '150'
    ctx.request.query.fit = 'outside'
    await testSharpOutput(() => {
      expect(sharpMock.resize).toBeCalledWith(50, 150, { fit: 'outside' })
    })
  })

  it('outputs png if requested', async function () {
    Object.assign(ctx, validCtx)
    ctx.request.query.format = 'png'
    await testSharpOutput(() => {
      expect(sharpMock.png).toBeCalled()
    })
  })

  it('outputs jpeg if requested', async function () {
    Object.assign(ctx, validCtx)
    ctx.request.query.format = 'jpeg'
    await testSharpOutput(() => {
      expect(sharpMock.jpeg).toBeCalled()
    })
  })

  it('creates cache folder if it doesn\'t exist', async function () {
    Object.assign(ctx, validCtx)
    await testSharpOutput(() => {
      expect(FsUtils.ensureDir as jest.Mock).toBeCalled()
    })
  })
})
