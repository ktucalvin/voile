/* eslint-env browser */
'use strict'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import ThumbnailGrid from '../components/ThumbnailGrid'
import Thumbnail from '../components/Thumbnail'
import TagBox from '../components/TagBox'

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
      .then(gallery => {
        document.title = gallery.name
        this.setState({ gallery })
      })
  }

  render () {
    if (!this.state.gallery) return null
    const { gallery } = this.state
    const ext = gallery.ext || gallery.extdecoder[gallery.extstring.charAt(0)]

    return (
      <div id='overview'>
        <div className='info'>
          <Thumbnail width={275} id={gallery.id} ext={ext} />
          <div>
            <p><b>{gallery.name}</b></p>
            {gallery.description && <p>{gallery.description}</p>}
            <p>Total pages: {gallery.totalPages}</p>
            <TagBox tags={gallery.tags} />
          </div>
        </div>
        <ThumbnailGrid gallery={gallery} />
        <Link to='/'>Back to galleries</Link>
      </div>
    )
  }
}

export default Overview
