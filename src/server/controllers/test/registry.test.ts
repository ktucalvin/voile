/* eslint-env jest */
import { Context } from 'koa'
import { getRepository } from 'typeorm'
import { createMockContext } from '@shopify/jest-koa-mocks'
import { Gallery } from '../../models/Gallery'
import { Chapter } from '../../models/Chapter'
import { PlainGallery } from '../../models/PlainGallery'
import { createTestDatabase, dropDatabaseChanges } from '../../lib/mock-db'
import { getRegistryInformation, getGalleryInformation } from '../registry-lookup'

describe('Registry Controller', function () {
  let ctx: Context

  beforeEach(async function () {
    await createTestDatabase()
    for (let i = 1; i <= 50; i++) {
      const g = new Gallery()
      g.galleryId = i
      g.galleryName = `Test gallery #${i}`
      await getRepository(Gallery).insert(g)
    }
    const c = new Chapter()
    c.galleryId = 23
    c.pages = 52
    c.chapterNumber = '1'
    c.chapterName = 'test chapter'
    await getRepository(Chapter).insert(c)
    ctx = createMockContext({
      customProperties: {
        params: {}
      }
    })
  })

  afterEach(async function () {
    await dropDatabaseChanges()
  })

  describe('GET /api/registry/:page', function () {
    it('responds with 400 given non-number', async function () {
      ctx.params.page = 'string'
      await getRegistryInformation(ctx)
      expect(ctx.status).toEqual(400)
    })

    it('responds with 400 given negative number', async function () {
      ctx.params.page = '-1'
      await getRegistryInformation(ctx)
      expect(ctx.status).toEqual(400)
    })

    it('defaults to page 1 if page not specified', async function () {
      await getRegistryInformation(ctx)
      const firstEntry = ctx.body.data[0]
      expect(firstEntry.id).toEqual(1)
    })

    it('retrieves the specified page', async function () {
      ctx.params.page = '2'
      await getRegistryInformation(ctx)
      const firstEntry = ctx.body.data[0]
      expect(firstEntry.id).toEqual(26)
    })
  })

  describe('GET /api/gallery/:id', function () {
    it('responds with 400 for non-integer id', async function () {
      ctx.params.id = 'astring'
      await getGalleryInformation(ctx)
      expect(ctx.status).toEqual(400)
    })

    it('responds with 404 for nonexistent galleries', async function () {
      ctx.params.id = 90000
      await getGalleryInformation(ctx)
      expect(ctx.status).toEqual(404)
    })

    it('retrieves gallery metadata', async function () {
      ctx.params.id = 23
      await getGalleryInformation(ctx)
      const result: PlainGallery = ctx.body
      expect(result.id).toEqual(23)
      expect(result.chapters[1].name).toEqual('test chapter')
      expect(result.chapters[1].pages).toEqual(52)
    })
  })

  describe('GET /api/random', function () {
    // This test does not work due to MySQL using RAND() and sqlite using RANDOM()
    it.todo('redirects to a random id')
    // function () {
    //   ctx.redirect = jest.fn()
    //   for (let i = 0; i < 50; i++) {
    //     getRandomGalleryId(ctx)
    //   }

    // const firstId = (ctx.redirect as jest.Mock).mock.calls[0][0]
    //   for (let i = 1; i < 50; i++) {
    //     if (firstId !== (ctx.redirect as jest.Mock).mock.calls[i]) {
    //       return
    //     }
    //   }

    //   throw new Error('Failed to generate new random ID after 50 tries')
    // }
  })
})
