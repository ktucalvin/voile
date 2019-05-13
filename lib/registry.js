'use strict'
require('dotenv').config()
const fs = require('fs')
const path = require('path')
const ARCHIVE_DIR = path.join(process.env.ARCHIVE_DIR)

const folders = fs.readdirSync(ARCHIVE_DIR)
const registry = new Map()
for (let folder of folders) {
  folder = path.join(ARCHIVE_DIR, folder + '')
  if (fs.lstatSync(folder).isFile()) { continue }
  const res = fs.readFileSync(path.join(folder, 'metadata.json'))
  const metadata = JSON.parse(res.toString())
  metadata.id = path.join('g', metadata.id + '')
  registry.set(metadata.id, metadata)
}

module.exports = [...registry]
