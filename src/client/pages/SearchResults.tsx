/* eslint-env browser */
'use strict'
import qs from 'qs'
import React, { Component } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { UnregisterCallback } from 'history'
import Preview from '../components/Preview'
import Paginator from '../components/Paginator'
import SearchPanel from '../components/SearchPanel'
import FilterControls from '../components/FilterControls'
import type { SortOptions, RegistryData, RawUrlSortOptions } from '@common/types/app'

interface SearchResultsState {
  query: SortOptions,
  registry: RegistryData
}

class SearchResults extends Component<RouteComponentProps, SearchResultsState> {
  private searchTimeout = 0
  private fetchController: AbortController | null = null
  private unlisten: UnregisterCallback | null = null

  handleQueryChange = (search: string) => {
    clearTimeout(this.searchTimeout)
    this.searchTimeout = window.setTimeout(() => {
      this.changeQuery(search)
    }, 250)
  }

  changeQuery (search?, page?, sort?, order?, length?) {
    search = search || this.state.query.search
    page = page || this.state.query.page
    sort = sort || this.state.query.sort
    order = order || this.state.query.order
    length = length || this.state.query.length
    let url = `?s=${search}`

    // Avoid writing defaults to URL querystring
    if (page > 1) {
      url += `&p=${page}`
    }

    if (length !== 25) {
      url += `&length=${length}`
    }

    if (sort !== 'id') {
      url += `&sort_by=${sort}`
    }

    if (order !== 'desc') {
      url += `&order_by=${order}`
    }

    this.props.history.push(url)
  }

  fetchGalleries () {
    this.fetchController = new AbortController()
    const rawQuery: RawUrlSortOptions = qs.parse(location.search, { ignoreQueryPrefix: true })
    const query = {
      search: rawQuery.s || '',
      page: parseInt(rawQuery.p!) || 1,
      sort: rawQuery.sort_by || 'id',
      order: rawQuery.order_by || 'desc',
      length: parseInt(rawQuery.length!) || 25
    }

    const endpoint = `/api/search?s=${query.search}&p=${query.page}&length=${query.length}&sort_by=${query.sort}&order_by=${query.order}`

    fetch(endpoint, { signal: this.fetchController.signal })
      .then(res => res.json())
      .then(registry => this.setState({ registry, query }))
      .catch(err => { if (err.name !== 'AbortError') console.error(err) })
  }

  render () {
    if (!this.state) return null

    if (!this.state.query.search) {
      return (
        <SearchPanel onSearch={this.handleQueryChange} />
      )
    }

    const { registry } = this.state
    if (this.state.query.search && !registry.pages) {
      return (
        <>
          <SearchPanel onSearch={this.handleQueryChange} />
          <p className='search-results-header'>No results found.</p>
        </>
      )
    }

    if (this.state.query.page && this.state.query.page > registry.pages && registry.pages != null) {
      return (
        <span className='error'>
          The requested page exceeds the number of galleries available.
          {registry.pages === 1 ? ' There is only one page.' : ` Page must be between 1 and ${registry.pages}.`}
        </span>
      )
    }

    return (
      <>
        <FilterControls onFilter={(sortBy, orderBy, length) => this.changeQuery(null, 1, sortBy, orderBy, length)} />
        <SearchPanel onSearch={this.handleQueryChange} />
        <p className='search-results-header'>Search Results for: {this.state.query.search} ({registry.validResults})</p>
        <div id='galleries'>
          {
            registry.data.map(gallery => (
              <Preview key={gallery.id} gallery={gallery} />
            ))
          }
        </div>
        <Paginator
          page={this.state.query.page || 1}
          totalPages={registry.pages}
          onPageChange={page => this.changeQuery(null, page)}
        />
      </>
    )
  }

  componentDidMount () {
    document.title = 'Voile'
    this.fetchGalleries()
    this.unlisten = this.props.history.listen(() => this.fetchGalleries())
  }

  shouldComponentUpdate (nextProps) {
    // !== implies only location has changed, not that new data was fetched
    // this prevents double render when changing pages
    return nextProps.location === this.props.location
  }

  componentWillUnmount () {
    this.fetchController && this.fetchController.abort()
    this.unlisten && this.unlisten()
  }
}

export default withRouter(SearchResults)
