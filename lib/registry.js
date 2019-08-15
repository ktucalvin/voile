'use strict'
require('dotenv').config()
const fs = require('fs')
const path = require('path')
const ARCHIVE_DIR = path.join(process.env.ARCHIVE_DIR)
const galleries = fs.readdirSync(ARCHIVE_DIR).map(e => path.join(ARCHIVE_DIR, e.toString()))
const registry = new Map()
const pageNumberRegex = /^(\d+)\.\w+/
const extensionRegex = /^\d+\.(\w+)/

/**
 *  This compresses a list of extensions into a more compact string
 *  e.g. ['jpg', 'jpg', 'jpg', 'png', 'jpg'] becomes 'aaaba' along with a decoder
 *  If all the extensions are uniform, then returns just that extension
 */
function compressExtensions (folder) {
  const extensions = fs.readdirSync(folder)
    .filter(e => pageNumberRegex.test(e)) // filter non-image files
    .sort((a, b) => { // natural sort for integer filenames
      const aVal = parseInt(pageNumberRegex.exec(a)[1])
      const bVal = parseInt(pageNumberRegex.exec(b)[1])
      return aVal - bVal
    })
    .map(e => extensionRegex.exec(e)[1]) // extract the extension
  const uniformExts = new Set(extensions).size === 1
  if (uniformExts) {
    return { ext: extensions[0] }
  }

  const extmap = new Map()
  const chars = charGenerator()
  let extstring = ''
  for (let i = 0; i < extensions.length; i++) {
    if (extmap.get(extensions[i])) {
      extstring += extmap.get(extensions[i])
    } else {
      const character = chars.next()
      if (character.done) throw new Error(`Encountered over 52 extensions while processing ${folder}`)
      extstring += character.value
      extmap.set(extensions[i], character.value)
    }
  }
  let extdecoder = {}
  for (const [key, val] of extmap) {
    extdecoder[val] = key
  }
  return { extstring, extdecoder }
}

function * charGenerator () {
  let values = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let index = 0
  while (index < values.length) {
    yield values.charAt(index)
    index++
  }
}

for (let gallery of galleries) {
  if (fs.lstatSync(gallery).isFile()) { continue }
  const metadata = JSON.parse(fs.readFileSync(path.join(gallery, 'metadata.json')).toString())
  const chapters = fs.readdirSync(gallery)
    .filter(e => /^[\d.]+$/.test(e))
    .map(e => e.toString())

  if (!metadata.chapters) {
    // Object instead of array allows special "decimal" chapters (e.g. 3.1)
    metadata.chapters = {}
    for (const chapter of chapters) {
      let chapterData = metadata.chapters[chapter]
      if (!chapterData) {
        chapterData = {
          pages: fs.readdirSync(path.join(gallery, chapter)).filter(e => pageNumberRegex.test(e)).length
        }
      }
      if (!chapterData.ext && !chapterData.extstring) {
        Object.assign(chapterData, compressExtensions(path.join(gallery, chapter)))
      }
      metadata.chapters[chapter] = chapterData
    }

    console.log(`Updating metadata for ${gallery}`)
    fs.writeFile(path.join(gallery, 'metadata.json'), JSON.stringify(metadata), err => {
      if (err) {
        console.error(`Failed to update ${path.join(gallery, 'metadata.json')}`)
        console.error(err)
        process.exit(1)
      }
    })
  }

  registry.set(metadata.id, metadata)
}

module.exports = registry
