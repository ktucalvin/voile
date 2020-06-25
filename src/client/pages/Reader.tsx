/* eslint-env browser */
'use strict'
import React, { Component } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import Paginator from '../components/Paginator'
import type { Gallery } from '@common/types/app'

interface ReaderState {
  gallery: Gallery
}

interface ReaderProps {
  match: {
    params: {
      id: string
      page: string,
      chapter: string
    }
  }
  location: {
    state: Gallery
  }
}

class Reader extends Component<ReaderProps & RouteComponentProps, ReaderState> {
  getAdjacentChapters = (chapterNumber) => {
    const chapters = Object.keys(this.state.gallery.chapters).map(parseFloat).sort((a, b) => a - b)
    const index = chapters.indexOf(parseFloat(chapterNumber))
    const nextChapter = chapters[index + 1]
    const prevChapter = chapters[index - 1]
    return [prevChapter, nextChapter]
  }

  handleKeyUp = (e) => {
    const $page = document.querySelector('#reader img')
    if (e.key === 'ArrowLeft') {
      this.handlePageChange({ clientX: 0 })
    } else if (e.key === 'ArrowRight') {
      this.handlePageChange({ clientX: 90000 })
    } else if (e.key === 'f' && $page) {
      $page.requestFullscreen()
    } else if (e.key === 'Esc') {
      document.exitFullscreen()
    }
  }

  handlePageChange = (e) => {
    const { gallery } = this.state
    const mid = document.querySelector('body')!.clientWidth / 2
    const chapterNumber = this.props.match.params.chapter
    const chapterData = gallery.chapters[this.props.match.params.chapter]
    let page = parseInt(this.props.match.params.page)

    // Return early for page turn
    if (e.clientX > mid && page < chapterData.pages) {
      page++
      this.props.history.push(`/g/${gallery.id}/${chapterNumber}/${page}`)
      return
    } else if (e.clientX <= mid && page > 1) {
      page--
      this.props.history.push(`/g/${gallery.id}/${chapterNumber}/${page}`)
      return
    }

    // If page was not turned, then change chapters
    const [prevChapter, nextChapter] = this.getAdjacentChapters(chapterNumber)

    if (prevChapter && page === 1) {
      const lastPage = gallery.chapters[prevChapter].pages
      this.props.history.push(`/g/${gallery.id}/${prevChapter}/${lastPage}`)
      return
    }

    if (nextChapter && page === chapterData.pages) {
      this.props.history.push(`/g/${gallery.id}/${nextChapter}/1`)
      return
    }

    // End of gallery, back to overview
    this.props.history.push({ pathname: `/g/${gallery.id}`, state: gallery })
  }

  componentDidMount () {
    document.addEventListener('keyup', this.handleKeyUp)
    if (this.props.location.state) {
      this.setState({ gallery: this.props.location.state })
    } else {
      fetch(`/api/galleries/${this.props.match.params.id}`)
        .then(res => res.json())
        .then(gallery => this.setState({ gallery }))
    }
  }

  render () {
    if (!this.state) return null
    const { gallery } = this.state
    const page = parseInt(this.props.match.params.page)
    const chapterNumber = parseFloat(this.props.match.params.chapter)
    const chapterData = gallery.chapters[chapterNumber]
    const [prevChapter, nextChapter] = this.getAdjacentChapters(chapterNumber)

    if (!chapterNumber || !chapterData) {
      return (<span className='error'>That chapter could not be found</span>)
    }

    if (!page || page > chapterData.pages || page < 1) {
      return (<span className='error'>That page could not be found</span>)
    }

    const src = `/i/${gallery.id}/${chapterNumber}/${page}`
    document.title = `${gallery.name} Ch.${chapterNumber} (${page}/${chapterData.pages})`

    return (
      <div id='reader'>
        <img src={src} onClick={this.handlePageChange} />
        <Paginator
          page={page}
          totalPages={chapterData.pages}
          onPageChange={page => this.props.history.push(`/g/${gallery.id}/${chapterNumber}/${page}`)}
        />
        {
          page === 1 &&
          prevChapter &&
            <Link to={`/g/${gallery.id}/${prevChapter}/1`}>Previous Chapter</Link>
        }
        {
          page === chapterData.pages &&
          nextChapter &&
            <Link to={`/g/${gallery.id}/${nextChapter}/1`}>Next Chapter</Link>
        }
        <Link to={{ pathname: `/g/${gallery.id}`, state: gallery }}>Back to overview</Link>
      </div>
    )
  }

  componentDidUpdate () {
    const { gallery } = this.state
    const page = parseInt(this.props.match.params.page)
    const chapterNumber = parseFloat(this.props.match.params.chapter)
    const chapterData = gallery.chapters[chapterNumber]
    if (chapterData && page + 1 <= chapterData.pages) {
      const img = new Image()
      img.src = `/i/${gallery.id}/${chapterNumber}/${page + 1}`
    }
  }

  componentWillUnmount () {
    document.removeEventListener('keyup', this.handleKeyUp)
  }
}

export default Reader
