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
    const mid = document.querySelector('body').clientWidth / 2
    let page = this.props.match.params.page
    if (e.clientX > mid && page < this.state.totalPages) {
      page++
    } else if (e.clientX <= mid && page > 1) {
      page--
    } else {
      this.props.history.push('/')
      return
    }
    this.props.history.push(`/g/${this.state.id}/${page}`)
  }

  componentDidMount () {
    fetch(`/api/gallery/${this.props.match.params.id}`)
      .then(res => res.json())
      .then(gallery => this.setState(gallery))
  }

  render () {
    if (!this.state) return null
    const page = parseInt(this.props.match.params.page)
    if (!page || page > this.state.totalPages || page < 1) {
      return (<span class='error'>That page could not be found</span>)
    }

    const extension = this.state.ext || this.state.extdecoder[this.state.extstring.charAt(page - 1)]
    const src = `/g/${this.state.id}/${page}.${extension}`

    return (
      <main>
        <div id='reader'>
          <img src={src} onClick={this.turnPage} />
          <Paginator
            page={page}
            totalPages={this.state.totalPages}
            onPageChange={page => this.props.history.push(`/g/${this.state.id}/${page}`)}
          />
          <Link to='/'>Back to galleries</Link>
        </div>
      </main>
    )
  }

  componentDidUpdate () {
    const page = parseInt(this.props.match.params.page)
    if (page + 1 <= this.state.totalPages) {
      const nextExtension = this.state.ext || this.state.extdecoder[this.state.extstring.charAt(page)]
      const img = new Image()
      img.src = `/g/${this.state.id}/${page + 1}.${nextExtension}`
    }
  }
}

export default Reader
