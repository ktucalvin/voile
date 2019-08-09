/* eslint-env browser */
'use strict'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Paginator from '../components/Paginator'

class Reader extends Component {
  constructor (props) {
    super(props)
    this.handleKeyUp = this.handleKeyUp.bind(this)
    this.turnPage = this.turnPage.bind(this)
  }

  handleKeyUp (e) {
    const $page = document.querySelector('#reader img')
    if (e.key === 'ArrowLeft') {
      this.turnPage({ clientX: 0 })
    } else if (e.key === 'ArrowRight') {
      this.turnPage({ clientX: 90000 })
    } else if (e.key === 'f' && $page) {
      $page.requestFullscreen()
    } else if (e.key === 'Esc') {
      document.exitFullscreen()
    }
  }

  turnPage (e) {
    const mid = document.querySelector('body').clientWidth / 2
    let page = this.props.match.params.page
    if (e.clientX > mid && page < this.state.totalPages) {
      page++
    } else if (e.clientX <= mid && page > 1) {
      page--
    } else {
      this.props.history.push(`/g/${this.state.id}`)
      return
    }
    this.props.history.push(`/g/${this.state.id}/${page}`)
  }

  componentDidMount () {
    document.addEventListener('keyup', this.handleKeyUp)
    fetch(`/api/gallery/${this.props.match.params.id}`)
      .then(res => res.json())
      .then(gallery => this.setState(gallery))
  }

  render () {
    if (!this.state) return null
    const page = parseInt(this.props.match.params.page)
    if (!page || page > this.state.totalPages || page < 1) {
      return (<span className='error'>That page could not be found</span>)
    }

    const extension = this.state.ext || this.state.extdecoder[this.state.extstring.charAt(page - 1)]
    const src = `/g/${this.state.id}/${page}.${extension}`
    document.title = `${this.state.name} (${page}/${this.state.totalPages})`

    return (
      <div id='reader'>
        <img src={src} onClick={this.turnPage} />
        <Paginator
          page={page}
          totalPages={this.state.totalPages}
          onPageChange={page => this.props.history.push(`/g/${this.state.id}/${page}`)}
        />
        <Link to={`/g/${this.state.id}`}>Back to overview</Link>
      </div>
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

  componentWillUnmount () {
    document.removeEventListener('keyup', this.handleKeyUp)
  }
}

export default Reader
