/* eslint-env browser */
'use strict'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Thumbnail from './Thumbnail'

class ThumbnailGrid extends Component {
  constructor (props) {
    super(props)
    this.state = {
      maxThumbs: 35
    }
  }

  render () {
    const { gallery } = this.props
    const ext = gallery.ext || gallery.extdecoder[gallery.extstring.charAt(0)]
    const thumbProps = {
      width: 300,
      id: gallery.id,
      ext
    }
    const thumbnails = []
    for (let i = 1; i <= Math.min(this.state.maxThumbs, gallery.totalPages); i++) {
      thumbnails.push(
        <Link key={i} to={`/g/${gallery.id}/${i}`}>
          <Thumbnail page={i} {...thumbProps} />
        </Link>
      )
    }
    return (
      <>
        <div className='thumbnails'>
          {thumbnails}
        </div>
        {
          this.state.maxThumbs <= gallery.totalPages &&
          <button onClick={() => this.setState({ maxThumbs: this.state.maxThumbs + 35 })}>Show more</button>
        }
      </>
    )
  }
}

export default ThumbnailGrid
