'use strict'
/* eslint-env mocha */
const { expect } = require('chai')
const mock = require('mock-require')
const fakeRegistry = new Map()

for (let i = 1; i <= 50; i++) {
  fakeRegistry.set(`TEST${i}`, {
    id: `TEST${i}`,
    totalPages: i,
    name: `test gallery #${i}`
  })
}

describe('/api', function () {
  let ctx, getRegistryInformation, getGalleryInformation
  before(function () {
    mock('../../lib/registry', fakeRegistry)
    const apis = require('../api')
    getRegistryInformation = apis.getRegistryInformation
    getGalleryInformation = apis.getGalleryInformation
  })
  beforeEach(function () { ctx = { params: {} } })
  after(function () { mock.stopAll() })

  describe('GET /registry/:page', function () {
    it('responds with 400 given non-number', function () {
      ctx.params.page = 'string'
      getRegistryInformation(ctx)
      expect(ctx.status).to.equal(400)
    })

    it('responds with 400 given negative number', function () {
      ctx.params.page = '-1'
      getRegistryInformation(ctx)
      expect(ctx.status).to.equal(400)
    })

    it('defaults to page 1 if page not specified', function () {
      getRegistryInformation(ctx)
      const firstEntry = ctx.body.data[0]
      expect(firstEntry.id).to.equal('TEST1')
    })

    it('retrieves the specified page', function () {
      ctx.params.page = '2'
      getRegistryInformation(ctx)
      const firstEntry = ctx.body.data[0]
      expect(firstEntry.id).to.equal('TEST26')
    })
  })

  describe('GET /gallery/:id', function () {
    it('responds with 404 for nonexistent galleries', function () {
      ctx.params.id = 'NOTREAL'
      getGalleryInformation(ctx)
      expect(ctx.status).to.equal(404)
    })

    it('retrieves gallery metadata', function () {
      ctx.params.id = 'TEST23'
      getGalleryInformation(ctx)
      const result = ctx.body
      expect(result.id).to.equal('TEST23')
      expect(result.totalPages).to.equal(23)
      expect(result.name).to.include('#23')
    })
  })
})
