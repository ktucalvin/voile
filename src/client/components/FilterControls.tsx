/* eslint-env browser */
'use strict'
import qs from 'qs'
import React, { Component } from 'react'
import type { SortOptions, RawUrlSortOptions } from '@common/types/app'

interface FilterControlsProps {
  onFilter(sort: string, order: string, length: number): void
}

interface FilterControlsState extends SortOptions {
  fitContain: boolean
}

export default class FilterControls extends Component<FilterControlsProps, FilterControlsState> {
  constructor (props) {
    super(props)
    const rawQuery: RawUrlSortOptions = qs.parse(location.search, { ignoreQueryPrefix: true })

    this.state = {
      fitContain: false,
      sort: rawQuery.sort_by || 'id',
      order: rawQuery.order_by || 'desc',
      length: parseInt(rawQuery.length!) || 25
    }
  }

  handleFilterChange = (sort?, order?, length?) => {
    sort = sort || this.state.sort
    order = order || this.state.order
    length = length || this.state.length
    this.props.onFilter(sort, order, length)
    this.setState({ sort, order, length })
  }

  handleImageFitChange = () => {
    if (!this.state.fitContain) {
      document.querySelector('body')!.classList.add('fit-contain')
    } else {
      document.querySelector('body')!.classList.remove('fit-contain')
    }
    this.setState({
      fitContain: !this.state.fitContain
    })
  }

  render () {
    return (
      <div id='filter-controls'>
        <div className='filter-section'>
          <div className='selector'>
          Sort By:
            <select onChange={e => this.handleFilterChange(e.target.value)} defaultValue={this.state.sort}>
              <option value='id'>ID</option>
              <option value='views'>Views</option>
              <option value='name'>Names</option>
            </select>
            <span className='select-arrow'>▼</span>
          </div>
          <button onClick={() => this.handleFilterChange(null, this.state.order === 'asc' ? 'desc' : 'asc')}>
            {this.state.order === 'asc' ? 'Ascending\u00A0↑' : 'Descending\u00A0↓' /* \u00A0 is &nbsp; */}
          </button>
        </div>

        <div className='filter-section'>
          <div className='selector'>
            Items per page
            <select onChange={e => this.handleFilterChange(null, null, e.target.value)} defaultValue={this.state.length}>
              <option value={1}>1</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className='select-arrow'>▼</span>
          </div>
          <button onClick={this.handleImageFitChange} style={{ marginLeft: 'auto' }}>Fit {this.state.fitContain ? 'Contain' : 'Cover'}</button>
        </div>
      </div>
    )
  }
}
