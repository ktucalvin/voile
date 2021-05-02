/* eslint-env browser */
'use strict'
import React, { Component } from 'react'

interface ThumbnailProps {
  id: number,
  name: string,
  chapter?: string,
  page?: number,
  width: number,
  observer?: IntersectionObserver
}

class Thumbnail extends Component<ThumbnailProps> {
  private ref: HTMLDivElement | null = null

  render () {
    const { width, id, chapter = 1, page = 1 } = this.props
    const pictureAttributes = {
      style: { display: this.state ? 'flex' : 'none', alignItems: 'center' },
      onLoad: () => this.setState({ loaded: true })
    }

    const src = `/api/img/${id}/${chapter}/${page}?w=${width}`
    const webpAttributes = {}
    const fallbackAttributes = {}
    webpAttributes[this.props.observer ? 'data-srcset' : 'srcSet'] = src
    fallbackAttributes[this.props.observer ? 'data-src' : 'src'] = src + '&format=jpeg'

    return (
      <div ref={ref => (this.ref = ref)}>
        <picture {...pictureAttributes}>
          <source {...webpAttributes} type='image/webp' />
          <img {...fallbackAttributes} alt={`${name} chapter ${chapter} page ${page}`}/>
        </picture>
        {!this.state && <i className='loader' />}
      </div>
    )
  }

  componentDidMount () {
    if (this.props.observer && this.ref) {
      this.props.observer.observe(this.ref)
    }
  }
}

export default Thumbnail
