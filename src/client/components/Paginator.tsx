/* eslint-env browser */
'use strict'
import React, { Component } from 'react'
import type { ReactElement } from 'react'
import withWidth from './WidthObserver'
import type { WidthObservingComponentProps } from './WidthObserver'

interface PaginatorProps extends WidthObservingComponentProps {
  onPageChange(page: number): void,
  page: number,
  totalPages: number
}

class Paginator extends Component<PaginatorProps> {
  goToPage = (page: number) => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
    this.props.onPageChange(page)
  }

  render () {
    let range = 2
    if (this.props.width > 800) {
      range = 8
    } else if (this.props.width > 400) {
      range = 4
    }
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

    const $buttons: ReactElement[] = []
    for (let i = startPage; i <= endPage; i++) {
      $buttons.push(
        <button
          key={i}
          onClick={() => this.goToPage(i)}
          className={i === currentPage ? 'currentPage' : ''}
        >
          {i}
        </button>
      )
    }

    if (startPage !== 1) {
      $buttons.unshift(<button key='first' onClick={() => this.goToPage(1)}>«</button>)
    }

    if (endPage !== this.props.totalPages) {
      $buttons.push(<button key='last' onClick={() => this.goToPage(this.props.totalPages)}>»</button>)
    }

    return (
      <div className='paginator'>
        {$buttons}
      </div>
    )
  }
}

export default withWidth<PaginatorProps>(Paginator, [400, 800])
