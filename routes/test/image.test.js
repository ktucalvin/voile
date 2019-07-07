'use strict'
/* eslint-env mocha */
const fs = require('fs')
const mock = require('mock-require')
const sinon = require('sinon')
const chai = require('chai')
chai.use(require('dirty-chai'))
chai.use(require('sinon-chai'))
const expect = chai.expect

const sharpMock = {
  resize: sinon.stub().callsFake(() => sharpMock),
  png: sinon.spy(),
  jpeg: sinon.spy(),
  webp: sinon.spy(),
  toFile: sinon.stub()
}

let ctx, validCtx
let resizeImage
let existsSyncStub, readdirSyncStub, createReadStreamStub, mkdirSyncStub

function expectStatusCode (code) {
  resizeImage(ctx)
  expect(ctx.status).to.equal(code)
}

function testSharpOutput (assertionFn) {
  existsSyncStub.callsFake(e => !e.includes('imgcache'))
  readdirSyncStub.returns(['1.png'])
  resizeImage(ctx)
  assertionFn()
}

describe('GET /i/:gallery/:page', function () {
  before(function () {
    mock('sharp', () => sharpMock)
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
        page: '1'
      },
      request: {
        query: {
          w: '50'
        }
      },
      set () {}
    }
    existsSyncStub = sinon.stub(fs, 'existsSync')
    readdirSyncStub = sinon.stub(fs, 'readdirSync')
    createReadStreamStub = sinon.stub(fs, 'createReadStream')
    mkdirSyncStub = sinon.stub(fs, 'mkdirSync')
  })

  afterEach(function () {
    existsSyncStub.restore()
    readdirSyncStub.restore()
    createReadStreamStub.restore()
    mkdirSyncStub.restore()
    for (const key in sharpMock) {
      sharpMock[key] = sinon.spy()
    }
    sharpMock.resize = sinon.stub().callsFake(() => sharpMock)
  })

  after(function () {
    mock.stopAll()
  })

  describe('responds with 400 when', function () {
    it('it does not receive gallery id', function () {
      ctx.params.page = '1'
      expectStatusCode(400)
    })

    it('it does not receive page number', function () {
      ctx.params.gallery = 'TEST'
      expectStatusCode(400)
    })

    it('it does not receive width', function () {
      ctx.params.page = '1'
      ctx.params.gallery = 'TEST'
      expectStatusCode(400)
    })

    it('given non-numeric page', function () {
      ctx.params.page = 'string'
      expectStatusCode(400)
    })

    it('given non-numeric width', function () {
      ctx.params.page = '1'
      ctx.params.gallery = 'TEST'
      ctx.request.query.w = 'string'
      expectStatusCode(400)
    })

    it('given non-numeric height', function () {
      Object.assign(ctx, validCtx)
      ctx.request.query.h = 'string'
      expectStatusCode(400)
    })

    it('given width less than 1', function () {
      ctx.params.page = '1'
      ctx.params.gallery = 'TEST'
      ctx.request.query.w = '-5'
      expectStatusCode(400)
    })

    it('given height less than 1', function () {
      Object.assign(ctx, validCtx)
      ctx.request.query.h = '-5'
      expectStatusCode(400)
    })

    it('given width over 2048', function () {
      ctx.params.page = '1'
      ctx.params.gallery = 'TEST'
      ctx.request.query.w = '2049'
      expectStatusCode(400)
    })

    it('given height over 2048', function () {
      ctx.params.page = '1'
      ctx.params.gallery = 'TEST'
      ctx.request.query.w = '50'
      ctx.request.query.h = '2049'
      expectStatusCode(400)
    })

    it('given invalid fit', function () {
      Object.assign(ctx, validCtx)
      ctx.request.query.fit = 'invalid'
      expectStatusCode(400)
    })

    it('given invalid format', function () {
      Object.assign(ctx, validCtx)
      ctx.request.query.format = 'invalid'
      expectStatusCode(400)
    })
  })

  it('responds with 404 if gallery doesn\'t exist', function () {
    existsSyncStub.returns(false)
    Object.assign(ctx, validCtx)
    expectStatusCode(404)
  })

  it('responds with 404 if page doesn\'t exist', function () {
    existsSyncStub.returns(true)
    readdirSyncStub.returns(['1', '2', '3', '4', '5'])
    Object.assign(ctx, validCtx)
    ctx.params.page = '7'
    expectStatusCode(404)
  })

  it('responds with 415 if image type cannot be resized', function () {
    existsSyncStub.returns(true)
    readdirSyncStub.returns(['1.gif'])
    Object.assign(ctx, validCtx)
    ctx.params.page = '1'
    expectStatusCode(415)
  })

  it('replaces jpg with jpeg', function () {
    existsSyncStub.returns(true)
    readdirSyncStub.returns(['1.png'])
    Object.assign(ctx, validCtx)
    ctx.request.query.format = 'jpg'
    ctx.set = sinon.spy()
    resizeImage(ctx)
    expect(ctx.set).to.be.calledWithExactly('Content-Type', 'image/jpeg')
  })

  it('serves cached file if it exists', function () {
    existsSyncStub.returns(true)
    readdirSyncStub.returns(['1.png'])
    createReadStreamStub.returns('test passed')
    Object.assign(ctx, validCtx)
    resizeImage(ctx)
    expect(ctx.body).to.equal('test passed')
    expect(createReadStreamStub).to.be.calledWith('./imgcache/TEST-1-50.webp')
  })

  it('writes optional information in cached filename', function () {
    existsSyncStub.returns(true)
    readdirSyncStub.returns(['1.png', '2.png'])
    Object.assign(ctx, validCtx)
    ctx.request.query.h = '50'
    ctx.request.query.fit = 'fill'
    ctx.request.query.format = 'png'
    resizeImage(ctx)
    expect(createReadStreamStub).to.be.calledWith('./imgcache/TEST-1-50x50-fill.png')
  })

  it('resizes image given only width', function () {
    Object.assign(ctx, validCtx)
    testSharpOutput(() => {
      expect(sharpMock.resize).to.be.calledWithExactly(50)
    })
  })

  it('resizes image given width and height', function () {
    Object.assign(ctx, validCtx)
    ctx.request.query.h = '150'
    testSharpOutput(() => {
      expect(sharpMock.resize).to.be.calledWithExactly(50, 150, { fit: 'cover' })
    })
  })

  it('resizes image given width, height, and fit', function () {
    Object.assign(ctx, validCtx)
    ctx.request.query.h = '150'
    ctx.request.query.fit = 'outside'
    testSharpOutput(() => {
      expect(sharpMock.resize).to.be.calledWithExactly(50, 150, { fit: 'outside' })
    })
  })

  it('outputs png if requested', function () {
    Object.assign(ctx, validCtx)
    ctx.request.query.format = 'png'
    testSharpOutput(() => {
      expect(sharpMock.png).to.be.called()
    })
  })

  it('outputs jpeg if requested', function () {
    Object.assign(ctx, validCtx)
    ctx.request.query.format = 'jpeg'
    testSharpOutput(() => {
      expect(sharpMock.jpeg).to.be.called()
    })
  })

  it('creates cache folder if it doesn\'t exist', function (done) {
    existsSyncStub.callsFake(e => {
      if (e.endsWith('TEST')) return true // does gallery exist?
      if (e === './imgcache/TEST-1-50.webp') return false // does a cached file exist?
      if (e === './imgcache') return false // does the cache folder exist?
    })
    readdirSyncStub.returns(['1.png'])
    Object.assign(ctx, validCtx)
    resizeImage(ctx)
    setTimeout(() => {
      expect(mkdirSyncStub).to.be.calledWith('./imgcache')
      done()
    })
  })
})
