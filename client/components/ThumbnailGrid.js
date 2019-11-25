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
    const { gallery, chapter } = this.props
    const thumbProps = {
      width: 300,
      id: gallery.id,
      chapter: chapter.number
    }
    const thumbnails = []
    for (let i = 1; i <= Math.min(this.state.maxThumbs, chapter.pages); i++) {
      const destination = {
        pathname: `/g/${gallery.id}/${chapter.number}/${i}`,
        state: gallery
      }

      thumbnails.push(
        <Link key={`${chapter.number}-${i}`} to={destination}>
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
          this.state.maxThumbs <= chapter.pages &&
            <button onClick={() => this.setState({ maxThumbs: this.state.maxThumbs + 35 })}>Show more</button>
        }
      </>
    )
  }
}

export default ThumbnailGrid
