/* eslint-env browser */
'use strict'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Thumbnail from './Thumbnail'

class Preview extends Component {
  render () {
    const { gallery } = this.props
    return (
      <div className='preview'>
        <Link to={`/g/${gallery.id}`}>
          <Thumbnail width={450} id={gallery.id} />
          <span>{gallery.name}</span>
        </Link>
      </div>
    )
  }
}

export default Preview
