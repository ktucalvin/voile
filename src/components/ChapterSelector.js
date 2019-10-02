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
    const $chapters = []
    const chapterNumbers = Object.keys(this.props.chapters).sort((a, b) => parseFloat(a) - parseFloat(b))
    for (const number of chapterNumbers) {
      const selected = number === this.state.selected ? 'selected-chapter' : undefined
      const chapterName = this.props.chapters[number].name || `Chapter ${number}`
      $chapters.push(
        <li key={number} onClick={() => this.handleClick(number)} className={selected}>
          <button>
            {chapterName}
          </button>
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
