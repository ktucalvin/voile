'use strict'
require('dotenv').config()
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const ARCHIVE_DIR = path.join(process.env.ARCHIVE_DIR)
const galleries = fs.readdirSync(ARCHIVE_DIR).map(e => path.join(ARCHIVE_DIR, e.toString()))
const registry = new Map()
const pageNumberRegex = /^(\d+)\.\w+/

for (let gallery of galleries) {
  if (fs.lstatSync(gallery).isFile()) { continue }
  let metadata
  const metafile = path.join(gallery, 'metadata.json')
  if (fs.existsSync(metafile)) {
    metadata = JSON.parse(fs.readFileSync(metafile, 'utf8'))
  } else {
    console.log(`No metadata for ${gallery}. Generating default file.`)
    metadata = {
      name: gallery,
      id: crypto.randomBytes(7).toString('hex'),
      tags: {}
    }
  }

  if (!metadata.chapters) {
    const chapters = fs.readdirSync(gallery)
      .filter(e => parseFloat(e))
      .map(e => e.toString())

    // Array-like objects allow special "decimal" chapters (e.g. 3.1)
    metadata.chapters = {}
    for (const chapter of chapters) {
      metadata.chapters[chapter] = {
        pages: fs.readdirSync(path.join(gallery, chapter)).filter(e => pageNumberRegex.test(e)).length
      }
    }

    console.log(`Updating metadata for ${gallery}`)
    fs.writeFile(metafile, JSON.stringify(metadata), err => {
      if (err) {
        console.error(`Failed to update ${metafile}`)
        throw err
      }
    })
  }

  if (registry.get(metadata.id)) {
    console.log(`Warning: Duplicate gallery id ${metadata.id}. Only the latest will be registered.`)
  }
  registry.set(metadata.id, metadata)
}

module.exports = registry
