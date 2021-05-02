/* eslint-env browser */
'use strict'
import React, { Component } from 'react'
import type { Chapter } from '@common/types/app'

interface ChapterSelectorProps {
  changeChapter(chapter: string): void,
  chapters: {
    [key: string]: Chapter
  }
}

interface ChapterSelectorState {
  selected: string
}

class ChapterSelector extends Component<ChapterSelectorProps, ChapterSelectorState> {
  constructor (props) {
    super(props)
    this.state = { selected: '1' }
  }

  handleClick = (chapter: string) => {
    this.props.changeChapter(chapter)
    this.setState({ selected: chapter })
  }

  render () {
    const chapterNumbers = Object.keys(this.props.chapters).sort((a, b) => parseFloat(a) - parseFloat(b))

    return (
      <ul className='chapter-selector'>
        {
          chapterNumbers.map(number => {
            const selected = number === this.state.selected ? 'selected-chapter' : undefined
            const chapterName = this.props.chapters[number].name || `Chapter ${number}`
            return (
              <li key={number} className={selected}>
                <button onClick={() => this.handleClick(number)}>
                  {chapterName}
                </button>
              </li>
            )
          })
        }
      </ul>
    )
  }
}

export default ChapterSelector
