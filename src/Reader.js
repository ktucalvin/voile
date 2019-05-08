/* eslint-env browser */
'use strict'
import React, { Component } from 'react'

class Reader extends Component {
  constructor (props) {
    super(props)
    this.turnPage = this.turnPage.bind(this)
    this.currentPage = 1
  }

  turnPage (e) {
    const width = document.querySelectorAll('body')[0].clientWidth / 2
    if (e.clientX > width) {
      this.currentPage < this.props.totalPages ? this.currentPage++ : document.location.reload()
    } else {
      this.currentPage > 1 ? this.currentPage-- : document.location.reload()
    }
    this.setState(() => this.currentPage)
  }

  render () {
    const cover = this.props.base + '/' + this.currentPage + '.jpg'
    return (
      <>
        <img src={cover} onClick={this.turnPage} />
        <span>{this.currentPage} of {this.props.totalPages}</span>
      </>
    )
  }
}

export default Reader
