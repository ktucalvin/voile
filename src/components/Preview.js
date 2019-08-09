/* eslint-env browser */
'use strict'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Thumbnail from './Thumbnail'

class Preview extends Component {
  render () {
    let { gallery } = this.props
    const ext = gallery.ext || gallery.extdecoder[gallery.extstring.charAt(0)]
    return (
      <div className='preview'>
        <Link to={`/g/${gallery.id}`}>
          <Thumbnail width={275} id={gallery.id} ext={ext} />
          <span>{gallery.name}</span>
        </Link>
      </div>
    )
  }
}

export default Preview
