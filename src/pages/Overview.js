/* eslint-env browser */
'use strict'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import ThumbnailGrid from '../components/ThumbnailGrid'
import Thumbnail from '../components/Thumbnail'
import TagBox from '../components/TagBox'
import ChapterSelector from '../components/ChapterSelector'

class Overview extends Component {
  constructor (props) {
    super(props)
    this.state = {
      maxThumbs: 35,
      chapterNumber: 1
    }
  }
  componentDidMount () {
    fetch(`/api/gallery/${this.props.match.params.id}`)
      .then(res => res.json())
      .then(gallery => {
        document.title = gallery.name
        this.setState({ gallery })
      })
  }

  render () {
    if (!this.state.gallery) return null
    const { gallery } = this.state
    const multiChapter = Object.keys(gallery.chapters).length > 1
    const chapterData = gallery.chapters[this.state.chapterNumber]
    chapterData.number = this.state.chapterNumber

    return (
      <div id='overview'>
        <div className='info'>
          <Thumbnail width={275} id={gallery.id} />
          <div>
            <p><b>{gallery.name}</b></p>
            {gallery.description && <p>{gallery.description}</p>}
            <TagBox tags={gallery.tags} />
          </div>
          {
            multiChapter &&
            <ChapterSelector
              chapters={gallery.chapters}
              changeChapter={c => this.setState({ chapterNumber: c })}
            />
          }
        </div>
        {
          multiChapter &&
          <h4 style={{ textAlign: 'left' }}>
            {`${chapterData.name || `Chapter ${this.state.chapterNumber}`} Preview:`}
          </h4>
        }
        <ThumbnailGrid gallery={gallery} chapter={chapterData} />
        <Link to='/'>Back to galleries</Link>
      </div>
    )
  }
}

export default Overview
