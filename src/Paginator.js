/* eslint-env browser */
'use strict'
import React, { Component } from 'react'

// Number of buttons to show at once
const range = 6

class Paginator extends Component {
  constructor (props) {
    super(props)
    this.goToPage = this.goToPage.bind(this)
  }

  goToPage (page) {
    document.activeElement.blur()
    this.props.onPageChange(page)
  }

  render () {
    const currentPage = this.props.page
    const offset = Math.floor(range / 2)
    let startPage = Math.max(1, currentPage - offset)
    let endPage = Math.min(this.props.totalPages, currentPage + offset)
    if (endPage - startPage + 1 < range) {
      if (startPage === 1) {
        endPage += range - endPage
      } else if (endPage === this.props.totalPages) {
        startPage -= range - (endPage - startPage) - 1
      }
    }

    startPage = Math.max(1, startPage)
    endPage = Math.min(this.props.totalPages, endPage)

    const buttons = []
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button onClick={() => this.goToPage(i)} className={i === currentPage ? 'currentPage' : ''}>{i}</button>
      )
    }

    if (startPage !== 1) {
      buttons.unshift(<button className='to-first' onClick={() => this.goToPage(1)}>«</button>)
    }

    if (endPage !== this.props.totalPages) {
      buttons.push(<button className='to-last' onClick={() => this.goToPage(this.props.totalPages)}>»</button>)
    }

    return (
      <div className='paginator'>
        {buttons}
      </div>
    )
  }
}

export default Paginator
