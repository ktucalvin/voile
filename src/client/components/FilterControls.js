/* eslint-env browser */
'use strict'
import qs from 'qs'
import React, { Component } from 'react'

export default class FilterControls extends Component {
  constructor (props) {
    super(props)
    const rawQuery = qs.parse(location.search, { ignoreQueryPrefix: true })

    this.state = {
      fitContain: false,
      sortBy: rawQuery.sort_by || 'id',
      orderBy: rawQuery.order_by || 'desc',
      length: parseInt(rawQuery.length) || 25
    }

    this.handleFilterChange = this.handleFilterChange.bind(this)
    this.handleImageFitChange = this.handleImageFitChange.bind(this)
  }

  handleFilterChange (sortBy, orderBy, length) {
    sortBy = sortBy || this.state.sortBy
    orderBy = orderBy || this.state.orderBy
    length = length || this.state.length
    this.props.onFilter(sortBy, orderBy, length)
    this.setState({ sortBy, orderBy, length: length })
  }

  handleImageFitChange () {
    if (!this.state.fitContain) {
      document.querySelector('body').classList.add('fit-contain')
    } else {
      document.querySelector('body').classList.remove('fit-contain')
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
            <select onChange={e => this.handleFilterChange(e.target.value)} defaultValue={this.state.sortBy}>
              <option value='id'>ID</option>
              <option value='views'>Views</option>
              <option value='name'>Names</option>
            </select>
            <span className='select-arrow'>▼</span>
          </div>
          <button onClick={() => this.handleFilterChange(null, this.state.orderBy === 'asc' ? 'desc' : 'asc')}>
            {this.state.orderBy === 'asc' ? 'Ascending\u00A0↑' : 'Descending\u00A0↓' /* \u00A0 is &nbsp; */}
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
