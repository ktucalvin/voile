/* eslint-env browser */
'use strict'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Thumbnail from './Thumbnail'
import withWidth from './WidthObserver'

class Preview extends Component {
  render () {
    let { gallery } = this.props
    const chapter = gallery.chapters[1]
    const ext = chapter.ext || chapter.extdecoder[chapter.extstring.charAt(0)]
    return (
      <div className='preview'>
        <Link to={`/g/${gallery.id}`}>
          <Thumbnail width={this.props.width <= 800 ? 400 : 275} id={gallery.id} ext={ext} />
          <span>{gallery.name}</span>
        </Link>
      </div>
    )
  }
}

export default withWidth(Preview, [800])
