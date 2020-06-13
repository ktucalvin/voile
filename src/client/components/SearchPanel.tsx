/* eslint-env browser */
'use strict'
import React, { Component } from 'react'

export interface SearchPanelProps {
  onSearch(query: string): void
}

class SearchPanel extends Component<SearchPanelProps> {
  private searchBar: HTMLInputElement

  render () {
    return (
      <div id='search-panel'>
        <input
          id='search-main'
          type='search'
          placeholder='Search...'
          ref={r => (this.searchBar = r)}
          onChange={() => this.props.onSearch(this.searchBar.value)}
        />
      </div>
    )
  }
}

export default SearchPanel
