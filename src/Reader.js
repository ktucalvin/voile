/* eslint-env browser */
'use strict'
import React, { Component } from 'react'
import Paginator from './Paginator'

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
    if (this.paginator) { this.paginator.setState({ page: this.currentPage }) }
  }

  render () {
    const id = this.props.src.slice(2)
    const src = id + '/' + this.currentPage.toString().padStart(2, '0') + '.jpg'
    return (
      <>
        <img src={src} onClick={this.turnPage} />
        <Paginator
          totalPages={this.props.totalPages}
          onPageChange={page => { this.currentPage = page; this.setState(() => this.currentPage) }}
          onClick={() => console.log('clicked')}
          ref={r => { this.paginator = r }}
        />
      </>
    )
  }
}

export default Reader
