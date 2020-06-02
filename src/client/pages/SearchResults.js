/* eslint-env browser */
'use strict'
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import Preview from '../components/Preview'
import Paginator from '../components/Paginator'
import SearchPanel from '../components/SearchPanel'
import FilterControls from '../components/FilterControls'
const searchRegex = /[?&]s=([^&#]+)/
const queryPageRegex = /[?&]p=(\d+)/

class SearchResults extends Component {
  constructor (props) {
    super(props)
    this.state = {}
    this.handleQueryChange = this.handleQueryChange.bind(this)
    this.searchTimeout = 0
  }

  handleQueryChange (query) {
    clearTimeout(this.searchTimeout)
    this.searchTimeout = setTimeout(() => {
      this.props.history.push(`/search?s=${query}`)
      this.updateQuery()
    }, 250)
  }

  updateQuery (page, sortBy = 'id', orderBy = 'DESC') {
    this.fetchController = new AbortController()
    if (!page) {
      const pg = queryPageRegex.exec(location.search)
      page = (pg && parseInt(pg[1])) || 1
    }

    const srch = searchRegex.exec(location.search)
    const query = (srch && srch[1])

    const endpoint = `/api/search?s=${query || this.state.query}&p=${page}&sort_by=${sortBy}&order_by=${orderBy}`

    fetch(endpoint, { signal: this.fetchController.signal })
      .then(res => res.json())
      .then(registry => this.setState({ page, registry, query }))
      .catch(err => { if (err.name !== 'AbortError') console.error(err) })
  }

  render () {
    if (!this.state) return null

    if (!this.state.query) {
      return (
        <SearchPanel onSearch={this.handleQueryChange} />
      )
    }

    const { registry } = this.state
    if (this.state.query && !registry.totalSize) {
      return (
        <>
          <SearchPanel onSearch={this.handleQueryChange} />
          <p className='search-results-header'>No results found.</p>
        </>
      )
    }

    if (this.state.page > registry.totalSize && registry.totalSize != null) {
      return (
        <span className='error'>
          The requested page exceeds the number of galleries available.
          {registry.totalSize === 1 ? ' There is only one page.' : ` Page must be between 1 and ${registry.totalSize}.`}
        </span>
      )
    }

    const result = []
    for (const gallery of registry.data) {
      result.push(<Preview key={gallery.id} gallery={gallery} />)
    }

    return (
      <>
        <SearchPanel onSearch={this.handleQueryChange} />
        <p className='search-results-header'>Search Results for: {this.state.query} ({registry.data.length})</p>
        <FilterControls onFilter={(sortBy, orderBy) => this.updateQuery(1, sortBy, orderBy)} />
        <div id='galleries'>
          {result}
        </div>
        <Paginator
          page={this.state.page}
          totalPages={registry.totalSize}
          onPageChange={page => this.state.query
            ? this.updateQuery(page)
            : this.props.history.push(`?p=${page}`)}
        />
      </>
    )
  }

  componentDidMount () {
    document.title = 'Voile'
    this.updateQuery()
    this.unlisten = this.props.history.listen(() => this.updateQuery())
  }

  componentWillUnmount () {
    this.unlisten()
    this.fetchController.abort()
  }
}

export default withRouter(SearchResults)
