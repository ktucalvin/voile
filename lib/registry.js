'use strict'
const fs = require('fs')
const path = require('path')
const ARCHIVE_DIR = path.resolve('./galleries')

const folders = fs.readdirSync(ARCHIVE_DIR)
const registry = new Map()
for (let folder of folders) {
  folder = path.join(ARCHIVE_DIR, folder)
  if (fs.lstatSync(folder).isFile()) { continue }
  const res = fs.readFileSync(path.join(folder, 'metadata.json'))
  const metadata = JSON.parse(res.toString())
  metadata.folder = folder
  registry.set(metadata.id, metadata)
}

console.log(registry)
