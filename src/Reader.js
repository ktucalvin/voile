/* eslint-env browser */
'use strict'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Paginator from './Paginator'

class Reader extends Component {
  constructor (props) {
    super(props)
    this.turnPage = this.turnPage.bind(this)
    document.addEventListener('keyup', e => {
      if (e.key === 'ArrowLeft') {
        this.turnPage({ clientX: 0 })
      } else if (e.key === 'ArrowRight') {
        this.turnPage({ clientX: 90000 })
      }
    })
  }

  turnPage (e) {
    const mid = document.querySelectorAll('body')[0].clientWidth / 2
    let page = this.props.match.params.page
    if (e.clientX > mid && page < this.state.totalPages) {
      page++
    } else if (e.clientX <= mid && page > 1) {
      page--
    } else {
      location.assign('/')
      return
    }

    this.props.history.push('/g/' + this.state.id + '/' + page)
    this.setState({ page })
  }

  componentDidMount () {
    fetch(`/api/gallery/${this.props.match.params.id}`)
      .then(res => res.json())
      .then(gallery => this.setState(gallery))
  }

  render () {
    // If the gallery metadata was not loaded yet
    if (!this.state) return null
    const page = this.props.match.params.page
    if (!parseInt(page) || page > this.state.totalPages || page < 1) {
      return (<span class='error'>That page could not be found</span>)
    }

    const src = '/g/' + this.state.id + '/' + page + this.state.ext
    return (
      <main>
        <div id='reader'>
          <img src={src} onClick={this.turnPage} />
          <Paginator
            page={parseInt(page)}
            totalPages={this.state.totalPages}
            onPageChange={page => this.props.history.push('/g/' + this.state.id + '/' + page)}
          />
          <Link to='/'>Back to galleries</Link>
        </div>
      </main>
    )
  }
}

export default Reader
