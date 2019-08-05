/* eslint-env browser */
'use strict'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class Preview extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    let { gallery } = this.props
    const ext = gallery.ext || gallery.extdecoder[gallery.extstring.charAt(0)]
    const attributes = {
      style: { display: this.state.loaded ? 'flex' : 'none', alignItems: 'center' },
      onLoad: () => this.setState({ loaded: true })
    }
    let thumbnail
    if (['jpg', 'png', 'jpeg'].includes(ext)) {
      thumbnail =
        <picture {...attributes}>
          <source srcset={`/i/${gallery.id}/1?w=275`} type='image/webp' />
          <img src={`/i/${gallery.id}/1?w=275&format=jpeg`} />
        </picture>
    } else {
      thumbnail = <img src={`/g/${gallery.id}/1.${ext}`} {...attributes} />
    }

    return (
      <div className='preview'>
        <Link to={`/g/${gallery.id}/1`}>
          {thumbnail}
          {!this.state.loaded && <i class='loader' />}
          <span>{gallery.name}</span>
        </Link>
      </div>
    )
  }
}

export default Preview
