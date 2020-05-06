/* eslint-env browser */
'use strict'
import React, { Component } from 'react'

class SearchPanel extends Component {
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
