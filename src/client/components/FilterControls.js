/* eslint-env browser */
'use strict'
import React, { Component } from 'react'

export default class FilterControls extends Component {
  constructor (props) {
    super(props)
    this.state = {
      sortBy: 'id',
      orderBy: 'DESC',
      fitContain: true
    }

    this.handleFilterChange = this.handleFilterChange.bind(this)
    this.handleImageFitChange = this.handleImageFitChange.bind(this)
  }

  handleFilterChange (sortBy, orderBy) {
    this.props.onFilter(sortBy, orderBy)
    this.setState({ sortBy, orderBy })
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
        Sort By:
        <div className='selector'>
          <select onChange={e => this.handleFilterChange(e.target.value, this.state.orderBy)}>
            <option value='id'>ID</option>
            <option value='views'>Views</option>
            <option value='name'>Names</option>
          </select>
          <span className='select-arrow'>▼</span>
        </div>
        <button onClick={() => this.handleFilterChange(this.state.sortBy, this.state.orderBy === 'ASC' ? 'DESC' : 'ASC')}>
          {this.state.orderBy === 'ASC' ? 'Ascending ↑' : 'Descending ↓'}
        </button>
        <button onClick={this.handleImageFitChange} style={{ marginLeft: 'auto' }}>Fit {this.state.fitContain ? 'Contain' : 'Cover'}</button>
      </div>
    )
  }
}
