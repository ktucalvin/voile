/* eslint-env browser */
'use strict'
import React, { Component } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import ThumbnailGrid from '../components/ThumbnailGrid'
import Thumbnail from '../components/Thumbnail'
import TagBox from '../components/TagBox'
import ChapterSelector from '../components/ChapterSelector'
import { ChapterWithNumber } from '../types/app-client'
import type { Gallery } from '@common/types/app'

interface OverviewProps {
  location: {
    state: Gallery
  },
  match: {
    params: {
      id: number
    }
  }
}

interface OverviewState {
  gallery?: Gallery,
  chapterNumber: string
}

class Overview extends Component<OverviewProps & RouteComponentProps, OverviewState> {
  constructor (props) {
    super(props)
    this.state = {
      chapterNumber: '1'
    }
  }

  componentDidMount () {
    if (this.props.location.state) {
      document.title = this.props.location.state.name
      this.setState({ gallery: this.props.location.state })
    } else {
      fetch(`/api/galleries/${this.props.match.params.id}`)
        .then(res => res.json())
        .then(gallery => {
          document.title = gallery.name
          this.setState({ gallery })
        })
    }
  }

  render () {
    if (!this.state.gallery) return null
    const { gallery } = this.state
    const multiChapter = Object.keys(gallery.chapters).length > 1
    const chapter = gallery.chapters[this.state.chapterNumber]
    const chapterData: ChapterWithNumber = {
      ...chapter,
      number: this.state.chapterNumber
    }

    return (
      <div id='overview'>
        <div className='info'>
          <Thumbnail width={275} id={gallery.id} />
          <div>
            <p><b>{gallery.name}</b></p>
            <TagBox tags={gallery.tags} />
            {gallery.description && <p>{gallery.description}</p>}
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
