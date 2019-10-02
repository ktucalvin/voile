/* eslint-env browser */
'use strict'
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import Preview from '../components/Preview'
import Paginator from '../components/Paginator'
const queryPageRegex = /[?&]p=(\d+)/

class Galleries extends Component {
  changePage (page) {
    this.fetchController = new AbortController()
    if (!page) {
      page = queryPageRegex.exec(location.search)
      page = (page && parseInt(page[1])) || 1
    }
    const endpoint = this.props.query
      ? `/api/search?s=${this.props.query}&p=${page}`
      : `/api/registry/${page}`

    fetch(endpoint, { signal: this.fetchController.signal })
      .then(res => res.json())
      .then(registry => this.setState({ page, registry }))
      .catch(err => { if (err.name !== 'AbortError') console.error(err) })
  }

  render () {
    if (!this.state) return null
    const { registry } = this.state
    if (this.props.query && !registry.totalSize) {
      return (<p className='search-results-header'>No results found.</p>)
    }

    if (this.state.page > registry.totalSize && registry.totalSize) {
      return (
        <span className='error'>
          The requested page exceeds the number of galleries available.
          Page must be between 1 and {registry.totalSize}.
        </span>
      )
    }

    const result = []
    for (const gallery of registry.data) {
      result.push(<Preview key={gallery.id} gallery={gallery} />)
    }

    return (
      <>
        {
          this.props.query &&
            <p className='search-results-header'>Search Results for: {this.props.query}</p>
        }
        <div id='galleries'>
          {result}
        </div>
        <Paginator
          page={this.state.page}
          totalPages={registry.totalSize}
          onPageChange={page => this.props.query
            ? this.changePage(page)
            : this.props.history.push(`?p=${page}`)}
        />
      </>
    )
  }

  componentDidMount () {
    document.title = 'Voile'
    this.changePage()
    this.unlisten = this.props.history.listen(() => this.changePage())
  }

  componentDidUpdate (prevProps) {
    if (prevProps.query !== this.props.query) {
      this.props.query ? this.changePage(1) : this.changePage()
    }
  }

  shouldComponentUpdate (nextProps) {
    // !== implies only location has changed, not that changePage fetched new data
    return nextProps.location === this.props.location
  }

  componentWillUnmount () {
    this.unlisten()
    this.fetchController.abort()
  }
}

export default withRouter(Galleries)
