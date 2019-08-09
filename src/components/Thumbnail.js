/* eslint-env browser */
'use strict'
import React, { Component } from 'react'

class Preview extends Component {
  render () {
    const { width, id, ext, page = 1 } = this.props
    const attributes = {
      style: { display: this.state ? 'flex' : 'none', alignItems: 'center' },
      onLoad: () => this.setState({ loaded: true })
    }
    if (['jpg', 'png', 'jpeg'].includes(this.props.ext)) {
      return (
        <>
          <picture {...attributes}>
            <source srcSet={`/i/${id}/${page}?w=${width}`} type='image/webp' />
            <img src={`/i/${id}/${page}?w=${width}&format=jpeg`} />
          </picture>
          {!this.state && <i className='loader' />}
        </>
      )
    }
    return (
      <>
        <img src={`/g/${id}/${page}.${ext}`} {...attributes} />
        {!this.state && <i className='loader' />}
      </>
    )
  }
}

export default Preview
