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
    const chapterNumber = this.props.match.params.chapter
    const chapterData = this.state.chapters[this.props.match.params.chapter]
    let page = this.props.match.params.page
    if (e.clientX > mid && page < chapterData.pages) {
      page++
    } else if (e.clientX <= mid && page > 1) {
      page--
    } else {
      this.props.history.push(`/g/${this.state.id}`)
      return
    }
    this.props.history.push(`/g/${this.state.id}/${chapterNumber}/${page}`)
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
    const chapterNumber = parseFloat(this.props.match.params.chapter)
    const chapterData = this.state.chapters[chapterNumber]

    if (!chapterNumber || chapterNumber > Object.keys(this.state.chapters).length || chapterNumber < 1) {
      return (<span className='error'>That chapter could not be found</span>)
    }

    if (!page || page > chapterData.pages || page < 1) {
      return (<span className='error'>That page could not be found</span>)
    }

    const src = `/i/${this.state.id}/${chapterNumber}/${page}`
    document.title = `${this.state.name} Ch.${chapterNumber} (${page}/${chapterData.pages})`

    return (
      <div id='reader'>
        <img src={src} onClick={this.turnPage} />
        <Paginator
          page={page}
          totalPages={chapterData.pages}
          onPageChange={page => this.props.history.push(`/g/${this.state.id}/${chapterNumber}/${page}`)}
        />
        <Link to={`/g/${this.state.id}`}>Back to overview</Link>
      </div>
    )
  }

  componentDidUpdate () {
    const page = parseInt(this.props.match.params.page)
    const chapterNumber = parseFloat(this.props.match.params.chapter)
    if (page + 1 <= this.state.chapters[chapterNumber].pages) {
      const img = new Image()
      img.src = `/i/${this.state.id}/${chapterNumber}/${page + 1}`
    }
  }

  componentWillUnmount () {
    document.removeEventListener('keyup', this.handleKeyUp)
  }
}

export default Reader
