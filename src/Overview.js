/* eslint-env browser */
'use strict'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Thumbnail from './Thumbnail'

class Overview extends Component {
  constructor (props) {
    super(props)
    this.state = {
      maxThumbs: 35
    }
  }
  componentDidMount () {
    fetch(`/api/gallery/${this.props.match.params.id}`)
      .then(res => res.json())
      .then(gallery => this.setState({ gallery }))
  }

  render () {
    if (!this.state.gallery) return null
    const { gallery } = this.state
    const ext = gallery.ext || gallery.extdecoder[gallery.extstring.charAt(0)]
    const thumbProps = {
      width: 200,
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
      <div id='overview'>
        <div className='info'>
          <Thumbnail width={275} id={gallery.id} ext={ext} />
          <div>
            <p><b>{gallery.name}</b></p>
            {gallery.description && <p>{gallery.description}</p>}
            <p>Total pages: {gallery.totalPages}</p>
            <span>Tags: {JSON.stringify(gallery.tags)}</span>
          </div>
        </div>
        <div className='thumbnails'>
          {thumbnails}
        </div>
        {
          this.state.maxThumbs <= gallery.totalPages &&
          <button className='show-more' onClick={() => this.setState({ maxThumbs: this.state.maxThumbs + 35 })}>Show more</button>
        }
        <Link to='/'>Back to galleries</Link>
      </div>
    )
  }
}

export default Overview
