/* eslint-env browser */
'use strict'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Reader from './Reader'

class Preview extends Component {
  constructor (props) {
    super(props)
    this.openReader = this.openReader.bind(this)
  }

  openReader () {
    const $reader = document.getElementById('reader')
    const $galleries = document.getElementById('galleries')
    $reader.style.display = 'block'
    $galleries.style.display = 'none'
    ReactDOM.render(<Reader src={this.props.src} totalPages={this.props.totalPages} key={Math.random() * 10000} ext={this.props.ext} />, $reader)
  }

  render () {
    const cover = this.props.src + '/1' + this.props.ext
    return (
      <div className='preview' onClick={this.openReader}>
        <img src={cover} />
        <span>{this.props.title}</span>
      </div>
    )
  }
}

export default Preview
