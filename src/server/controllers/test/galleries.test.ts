/* eslint-env jest */
import { Context } from 'koa'
import { getRepository } from 'typeorm'
import { createMockContext } from '@shopify/jest-koa-mocks'
import { Gallery } from '../../models/Gallery'
import { Chapter } from '../../models/Chapter'
import type { Gallery as CommonGallery } from '@common/types/app'
import { createTestDatabase, dropDatabaseChanges } from '../../lib/mock-db'
import { getGalleries, getGalleryInformation } from '../galleries'

describe('Registry Controller', function () {
  let ctx: Context

  beforeEach(async function () {
    await createTestDatabase()
    for (let i = 1; i <= 50; i++) {
      const g = new Gallery()
      g.galleryId = i
      g.galleryName = `Test gallery #${i}`
      g.views = 100 - i
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

  describe('GET /api/galleries', function () {
    it('responds with 400 given non-number', async function () {
      ctx.query.p = 'string'
      await getGalleries(ctx)
      expect(ctx.status).toEqual(400)
    })

    it('responds with 400 given negative number', async function () {
      ctx.query.p = '-1'
      await getGalleries(ctx)
      expect(ctx.status).toEqual(400)
    })

    it('defaults to page 1, sort by id desc if page not specified', async function () {
      await getGalleries(ctx)
      const firstEntry = ctx.body.data[0]
      expect(firstEntry.id).toEqual(50)
    })

    it('retrieves the specified page', async function () {
      ctx.query.p = '2'
      await getGalleries(ctx)
      const firstEntry = ctx.body.data[0]
      expect(firstEntry.id).toEqual(25)
    })
    it('sorts galleries by a given property', async function () {
      ctx.query.sort_by = 'views'
      await getGalleries(ctx)
      const firstEntry = ctx.body.data[0]
      expect(firstEntry.id).toEqual(1)
    })

    it('orders results by a given order', async function () {
      ctx.query.order_by = 'asc'
      await getGalleries(ctx)
      const firstEntry = ctx.body.data[0]
      expect(firstEntry.id).toEqual(1)
    })

    it('retrieves the specified number of galleries', async function () {
      ctx.query.length = '35'
      await getGalleries(ctx)
      expect(ctx.body.data.length).toEqual(35)
    })
  })

  describe('GET /api/galleries/:id', function () {
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
      const result: CommonGallery = ctx.body
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
