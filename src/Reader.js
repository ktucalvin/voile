/* eslint-env browser */
'use strict'
import React, { Component } from 'react'
import Paginator from './Paginator'

class Reader extends Component {
  constructor (props) {
    super(props)
    this.state = {
      page: 1
    }
    this.turnPage = this.turnPage.bind(this)
    history.pushState({ isReading: true }, '', `${this.props.src}`)
  }

  turnPage (e) {
    const width = document.querySelectorAll('body')[0].clientWidth / 2
    let page = this.state.page
    if (e.clientX > width) {
      page < this.props.totalPages ? page++ : history.back()
    } else {
      page > 1 ? page-- : history.back()
    }
    this.setState({ page })
    if (this.paginator) { this.paginator.setState({ page }) }
  }

  render () {
    const id = this.props.src.slice(2)
    const src = id + '/' + this.state.page.toString().padStart(2, '0') + '.jpg'
    return (
      <>
        <img src={src} onClick={this.turnPage} />
        <Paginator
          totalPages={this.props.totalPages}
          onPageChange={page => this.setState({ page })}
          onClick={() => console.log('clicked')}
          ref={r => { this.paginator = r }}
        />
        <a href='/'>Back to galleries</a>
      </>
    )
  }
}

export default Reader
