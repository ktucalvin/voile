'use strict'
/* eslint-env mocha */
const fsp = require('fs').promises
const mock = require('mock-require')
const sinon = require('sinon')
const chai = require('chai')
chai.use(require('dirty-chai'))
chai.use(require('sinon-chai'))
const expect = chai.expect
const fsutils = require('../../lib/fsutils')

const sharpMock = {
  resize: sinon.stub(),
  clone: sinon.stub().callsFake(() => sharpMock),
  png: sinon.spy(),
  jpeg: sinon.spy(),
  webp: sinon.spy(),
  toFile: sinon.stub()
}

let ctx, validCtx
let resizeImage
let createReadStreamStub, ensureDirStub, readdirStub
const sendSpy = sinon.spy()

async function expectStatusCode (code) {
  await resizeImage(ctx)
  expect(ctx.status).to.equal(code)
}

async function testSharpOutput (assertionFn) {
  createReadStreamStub.throws() // fake inability to serve cached file
  readdirStub.returns(['1.png'])
  await resizeImage(ctx)
  assertionFn()
}

describe('GET /api/img/:gallery/:chapter/:page', function () {
  before(function () {
    mock('sharp', () => sharpMock)
    mock('koa-send', sendSpy)
    resizeImage = require('../image').resizeImage
  })

  beforeEach(function () {
    ctx = {
      params: {},
      request: {
        query: {}
      }
    }
    validCtx = {
      params: {
        gallery: 'TEST',
        chapter: '1',
        page: '1'
      },
      request: {
        query: { w: '50' }
      },
      set () {}
    }
    createReadStreamStub = sinon.stub(fsutils, 'createReadStream')
    ensureDirStub = sinon.stub(fsutils, 'ensureDir')
    readdirStub = sinon.stub(fsp, 'readdir')
  })

  afterEach(function () {
    createReadStreamStub.restore()
    readdirStub.restore()
    ensureDirStub.restore()
    for (const key in sharpMock) {
      sharpMock[key] = sinon.spy()
    }
    sharpMock.clone = sinon.stub().callsFake(() => sharpMock)
  })

  after(function () {
    mock.stopAll()
  })

  describe('responds with 400 when', function () {
    it('it does not receive gallery id', async function () {
      ctx.params.page = '1'
      ctx.params.chapter = '1'
      await expectStatusCode(400)
    })

    it('it does not receive chapter number', async function () {
      ctx.params.gallery = 'TEST'
      ctx.params.page = '1'
      await expectStatusCode(400)
    })

    it('it does not receive page number', async function () {
      ctx.params.gallery = 'TEST'
      ctx.params.chapter = '1'
      await expectStatusCode(400)
    })

    it('it does not receive width', async function () {
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
    createReadStreamStub.throws()
    Object.assign(ctx, validCtx)
    await expectStatusCode(404)
  })

  it('responds with 404 if page doesn\'t exist', async function () {
    readdirStub.returns(['1', '2', '3', '4', '5'])
    Object.assign(ctx, validCtx)
    ctx.params.page = '7'
    await expectStatusCode(404)
  })

  it('sends original image if it cannot be resized', async function () {
    readdirStub.returns(['1.gif'])
    Object.assign(ctx, validCtx)
    ctx.params.page = '1'
    await resizeImage(ctx)
    expect(sendSpy).to.be.called()
  })

  it('replaces jpg with jpeg', async function () {
    readdirStub.returns(['1.png'])
    Object.assign(ctx, validCtx)
    ctx.request.query.format = 'jpg'
    ctx.set = sinon.spy()
    await resizeImage(ctx)
    expect(ctx.set).to.be.calledWithExactly('Content-Type', 'image/jpeg')
  })

  it('serves cached file if it exists', async function () {
    readdirStub.returns(['1.png'])
    createReadStreamStub.returns('test passed')
    Object.assign(ctx, validCtx)
    await resizeImage(ctx)
    expect(ctx.body).to.equal('test passed')
    expect(createReadStreamStub).to.be.calledWith('./imgcache/TEST-C1P1-50.webp')
  })

  it('writes optional information in cached filename', async function () {
    readdirStub.returns(['1.png', '2.png'])
    Object.assign(ctx, validCtx)
    ctx.request.query.h = '50'
    ctx.request.query.fit = 'fill'
    ctx.request.query.format = 'png'
    await resizeImage(ctx)
    expect(createReadStreamStub).to.be.calledWith('./imgcache/TEST-C1P1-50x50-fill.png')
  })

  it('resizes image given only width', async function () {
    Object.assign(ctx, validCtx)
    await testSharpOutput(() => {
      expect(sharpMock.resize).to.be.calledWithExactly(50)
    })
  })

  it('resizes image given width and height', async function () {
    Object.assign(ctx, validCtx)
    ctx.request.query.h = '150'
    await testSharpOutput(() => {
      expect(sharpMock.resize).to.be.calledWithExactly(50, 150, { fit: 'cover' })
    })
  })

  it('resizes image given width, height, and fit', async function () {
    Object.assign(ctx, validCtx)
    ctx.request.query.h = '150'
    ctx.request.query.fit = 'outside'
    await testSharpOutput(() => {
      expect(sharpMock.resize).to.be.calledWithExactly(50, 150, { fit: 'outside' })
    })
  })

  it('outputs png if requested', async function () {
    Object.assign(ctx, validCtx)
    ctx.request.query.format = 'png'
    await testSharpOutput(() => {
      expect(sharpMock.png).to.be.called()
    })
  })

  it('outputs jpeg if requested', async function () {
    Object.assign(ctx, validCtx)
    ctx.request.query.format = 'jpeg'
    await testSharpOutput(() => {
      expect(sharpMock.jpeg).to.be.called()
    })
  })

  it('creates cache folder if it doesn\'t exist', async function () {
    Object.assign(ctx, validCtx)
    await testSharpOutput(() => {
      expect(ensureDirStub).to.be.called()
    })
  })
})
