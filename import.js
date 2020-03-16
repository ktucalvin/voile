'use strict'
require('dotenv').config()
const fs = require('fs')
const path = require('path')
const mysql = require('promise-mysql')

// Directory to import from
const basedir = './galleries'

// Where to put symlinked galleries
const targetDir = './staticGalleries'

// Preserve any ordering with numbers
const galleries = fs.readdirSync(basedir)
  .filter(e => !fs.lstatSync(path.join(basedir, e)).isFile())
  .sort((a, b) => {
    if (/^[A-Za-z]/.test(a)) {
      return 5000
    }

    if (/^[A-Za-z]/.test(b)) {
      return -5000
    }

    return a.localeCompare(b, undefined, { numeric: true })
  })

const tagTypes = ['language', 'character', 'category', 'group', 'parody', 'artist', 'content']

function ensureDir (path) {
  try {
    fs.mkdirSync(path, { recursive: true })
  } catch (err) {
    if (err.code !== 'EEXIST') { throw err }
  }
}

;(async function () {
  try {
    const pool = await mysql.createPool({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    })

    for (const gallery of galleries) {
      // Process gallery (top-level)
      const raw = fs.readFileSync(path.join(basedir, gallery, 'metadata.json'))
      const metadata = JSON.parse(raw)
      console.log(`Processing ${path.join(basedir, gallery)}`)
      const gid = (await pool.query(
        'INSERT INTO galleries (gallery_name, description) VALUES (?, ?)',
        [metadata.name, metadata.description]
      )).insertId
      console.log(`ID: ${gid}\tName: ${metadata.name}\tDesc? ${!!metadata.description}`)

      // Link gallery
      await ensureDir(targetDir)
      const chapterDir = path.resolve(basedir, gallery)
      const next = path.resolve(targetDir, gid + '')
      console.log(`Link ${chapterDir} to ${next}`)
      fs.symlinkSync(chapterDir, next)

      // Processing chapters
      const chapterNumbers = Object.keys(metadata.chapters).map(e => parseFloat(e)).sort((a, b) => a - b)
      for (const num of chapterNumbers) {
        const chapter = metadata.chapters[num]
        await pool.query(
          'INSERT INTO chapters (gallery_id, chapter_number, pages, chapter_name) values (?, ?, ?, ?)',
          [gid, num, chapter.pages, chapter.name]
        )
        console.log(`\tCNum: ${num}\tPages: ${chapter.pages}\tCName? ${!!chapter.name}`)
      }

      // Insert tags
      for (const category of tagTypes) {
        const tags = metadata.tags[category] || []
        console.log(`\t${category}: ${tags.join(', ')}`)
        for (const tag of tags) {
          await pool.query(
            'INSERT IGNORE INTO tags (tag_name, type) VALUES (?, ?)',
            [tag, category]
          )

          const tagLookup = await pool.query(
            'SELECT tag_id FROM tags WHERE tag_name=? AND type=?',
            [tag, category]
          )

          const tagId = tagLookup[0].tag_id

          await pool.query(
            'INSERT INTO galleries_tags (gallery_id, tag_id) VALUES (?, ?)',
            [gid, tagId]
          )
        }
      }
    }
  } catch (err) {
    console.error(err)
  }
  process.exit(0)
})()
