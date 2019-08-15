/* eslint-env browser */
'use strict'
import React, { Component } from 'react'

class Preview extends Component {
  render () {
    const { width, id, ext, chapter = 1, page = 1 } = this.props
    const attributes = {
      style: { display: this.state ? 'flex' : 'none', alignItems: 'center' },
      onLoad: () => this.setState({ loaded: true })
    }
    if (['jpg', 'png', 'jpeg'].includes(this.props.ext)) {
      return (
        <>
          <picture {...attributes}>
            <source srcSet={`/i/${id}/${chapter}/${page}?w=${width}`} type='image/webp' />
            <img src={`/i/${id}/${chapter}/${page}?w=${width}&format=jpeg`} />
          </picture>
          {!this.state && <i className='loader' />}
        </>
      )
    }
    return (
      <>
        <img src={`/g/${id}/${chapter}/${page}.${ext}`} {...attributes} />
        {!this.state && <i className='loader' />}
      </>
    )
  }
}

export default Preview
