'use strict'
require('dotenv').config()
const fs = require('fs')
const path = require('path')
const ARCHIVE_DIR = path.join(process.env.ARCHIVE_DIR)
const folders = fs.readdirSync(ARCHIVE_DIR)
const registry = new Map()

/**
 *  This compresses a list of extensions into a more compact string
 *  e.g. ['jpg', 'jpg', 'jpg', 'png', 'jpg'] becomes 'aaaba' along with a decoder
 *  If all the extensions are uniform, then returns just that extension
 */
function compressExtensions (folder) {
  const extensions = fs.readdirSync(folder)
    .filter(e => /^\d+\./.test(e)) // filter non-image files
    .sort((a, b) => { // natural sort for integer filenames
      const aVal = parseInt(/^(\d+)\.\w+/.exec(a)[1])
      const bVal = parseInt(/^(\d+)\.\w+/.exec(b)[1])
      return aVal - bVal
    })
    .map(e => /^\d+\.(\w+)/.exec(e)[1]) // extract the extension
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

for (let folder of folders) {
  folder = path.join(ARCHIVE_DIR, folder + '')
  if (fs.lstatSync(folder).isFile()) { continue }
  const res = fs.readFileSync(path.join(folder, 'metadata.json'))
  const metadata = JSON.parse(res.toString())
  if (!metadata.ext && !metadata.extstring) {
    Object.assign(metadata, compressExtensions(folder))
    fs.writeFile(path.join(folder, 'metadata.json'), JSON.stringify(metadata), err => {
      if (err) {
        console.error(`Failed to update ${path.join(folder, 'metadata.json')} while writing file extension information`)
        console.error(err)
        process.exit(1)
      }
    })
  }
  registry.set(metadata.id, metadata)
}

module.exports = registry
