/* eslint-env browser */
'use strict'
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import Preview from '../components/Preview'
import Paginator from '../components/Paginator'
import FilterControls from '../components/FilterControls'
const queryPageRegex = /[?&]p=(\d+)/

class Galleries extends Component {
  changePage (page, sortBy = 'id', orderBy = 'DESC') {
    this.fetchController = new AbortController()
    if (!page) {
      const pg = queryPageRegex.exec(location.search)
      page = (pg && parseInt(pg[1])) || 1
    }

    const endpoint = `/api/galleries?p=${page}&sort_by=${sortBy}&order_by=${orderBy}`

    fetch(endpoint, { signal: this.fetchController.signal })
      .then(res => res.json())
      .then(registry => this.setState({ page, registry }))
      .catch(err => { if (err.name !== 'AbortError') console.error(err) })
  }

  render () {
    if (!this.state) return null
    const { registry } = this.state

    if (this.state.page > registry.totalSize && registry.totalSize != null) {
      return (
        <span className='error'>
          The requested page exceeds the number of galleries available.
          {registry.totalSize === 1 ? ' There is only one page.' : ` Page must be between 1 and ${registry.totalSize}`}
        </span>
      )
    }

    const result = []
    for (const gallery of registry.data) {
      result.push(<Preview key={gallery.id} gallery={gallery} />)
    }

    return (
      <>
        <FilterControls onFilter={(sortBy, orderBy) => this.changePage(1, sortBy, orderBy)} />
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