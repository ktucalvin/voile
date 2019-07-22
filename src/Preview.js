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
    let { ext, src } = this.props
    const attributes = {
      style: { display: this.state.loaded ? 'flex' : 'none', alignItems: 'center' },
      onLoad: () => this.setState({ loaded: true })
    }
    let thumbnail
    if (['jpg', 'png', 'jpeg'].includes(ext)) {
      thumbnail =
        <picture {...attributes}>
          <source srcset={`/i/${src}/1?w=200`} type='image/webp' />
          <img src={`/i/${src}/1?w=200&format=jpeg`} />
        </picture>
    } else {
      thumbnail = <img src={`/g/${src}/1.${this.props.ext}`} {...attributes} />
    }
    return (
      <div className='preview'>
        <Link to={`/g/${src}/1`}>
          {thumbnail}
          {!this.state.loaded && <i class='loader' />}
          <span>{this.props.title}</span>
        </Link>
      </div>
    )
  }
}

export default Preview
