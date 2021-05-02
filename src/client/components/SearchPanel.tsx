/* eslint-env browser */
'use strict'
import React from 'react'

interface SearchPanelProps {
  onSearch(query: string): void
}

const SearchPanel = (props: SearchPanelProps) => (
  <div id='search-panel'>
    <input
      id='search-main'
      type='search'
      placeholder='Search...'
      onChange={e => props.onSearch(e.target.value)}
    />
  </div>
)

SearchPanel.displayName = 'SearchPanel'

export default SearchPanel
