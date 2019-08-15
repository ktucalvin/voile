/* eslint-env browser */
'use strict'
import React, { Component } from 'react'

class ChapterSelector extends Component {
  constructor (props) {
    super(props)
    this.state = { selected: '1' }
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick (chapter) {
    this.props.changeChapter(chapter)
    this.setState({ selected: chapter })
  }

  render () {
    let $chapters = []
    const chapterNumbers = Object.keys(this.props.chapters).sort((a, b) => parseFloat(a) - parseFloat(b))
    for (const chapter of chapterNumbers) {
      $chapters.push(
        <li key={chapter} onClick={() => this.handleClick(chapter)} className={chapter === this.state.selected ? 'selected-chapter' : ''}>
          Chapter {chapter}
        </li>
      )
    }

    return (
      <ul className='chapter-selector'>
        {$chapters}
      </ul>
    )
  }
}

export default ChapterSelector
