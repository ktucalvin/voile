/* eslint-env browser */
'use strict'
import React, { Component } from 'react'
import type { ReactElement } from 'react'
import { Link } from 'react-router-dom'
import Thumbnail from './Thumbnail'
import type { Gallery } from '@common/types/app'
import type { ChapterWithNumber } from '../types/app-client'

interface ThumbnailGridProps {
  gallery: Gallery,
  chapter: ChapterWithNumber
}

class ThumbnailGrid extends Component<ThumbnailGridProps> {
  private observer: IntersectionObserver

  constructor (props) {
    super(props)
    this.observer = new IntersectionObserver(this.lazyLoadThumbs, {
      rootMargin: '0px 0px 100px 0px'
    })
  }

  lazyLoadThumbs = (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const $images = entry.target.children[0].children
        for (const $img of $images) {
          if (!$img.src) {
            $img.srcset = $img.dataset.srcset
            $img.src = $img.dataset.src
          }
        }
        this.observer.unobserve(entry.target)
      }
    }
  }

  render () {
    const { gallery, chapter } = this.props
    const thumbProps = {
      width: 300,
      id: gallery.id,
      name: gallery.name,
      chapter: chapter.number
    }
    const $thumbnails: ReactElement[] = []
    for (let i = 1; i <= chapter.pages; i++) {
      const destination = {
        pathname: `/g/${gallery.id}/${chapter.number}/${i}`,
        state: gallery
      }

      $thumbnails.push(
        <Link key={`${chapter.number}-${i}`} to={destination}>
          <Thumbnail page={i} {...thumbProps} observer={this.observer} />
        </Link>
      )
    }

    return (
      <div className='thumbnails'>
        {$thumbnails}
      </div>
    )
  }
}

export default ThumbnailGrid
