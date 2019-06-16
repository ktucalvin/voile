/* eslint-env browser */
'use strict'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class Preview extends Component {
  render () {
    const cover = '/g/' + this.props.src + '/1' + this.props.ext
    return (
      <Link to={`/g/${this.props.src}/1`}>
        <div className='preview'>
          <img src={cover} />
          <span>{this.props.title}</span>
        </div>
      </Link>
    )
  }
}

export default Preview
