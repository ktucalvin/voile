/* eslint-env browser */
'use strict'
import React, { Component } from 'react'

class Reader extends Component {
  constructor (props) {
    super(props)
    this.turnPage = this.turnPage.bind(this)
    this.currentPage = 1
    history.pushState({ isReading: true }, '', `${this.props.src}`)
  }

  turnPage (e) {
    const width = document.querySelectorAll('body')[0].clientWidth / 2
    if (e.clientX > width) {
      this.currentPage < this.props.totalPages ? this.currentPage++ : history.back()
    } else {
      this.currentPage > 1 ? this.currentPage-- : history.back()
    }
    this.setState(() => this.currentPage)
  }

  render () {
    const id = this.props.src.slice(2)
    const src = id + '/' + this.currentPage.toString().padStart(2, '0') + '.jpg'
    return (
      <>
        <img src={src} onClick={this.turnPage} />
        <span>{this.currentPage} of {this.props.totalPages}</span>
      </>
    )
  }
}

export default Reader
