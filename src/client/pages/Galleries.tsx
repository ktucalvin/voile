/* eslint-env browser */
'use strict'
import qs from 'qs'
import React, { Component } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { UnregisterCallback } from 'history'
import Preview from '../components/Preview'
import Paginator from '../components/Paginator'
import FilterControls from '../components/FilterControls'
import type { SortOptions, RawUrlSortOptions, RegistryData } from '@common/types/app'

interface GalleriesState {
  query: SortOptions,
  registry: RegistryData
}

class Galleries extends Component<RouteComponentProps, GalleriesState> {
  private fetchController: AbortController | null = null
  private unlisten: UnregisterCallback | null = null

  changeQuery (page?, sort?, order?, length?) {
    page = page || this.state.query.page
    sort = sort || this.state.query.sort
    order = order || this.state.query.order
    length = length || this.state.query.length
    let parts = 0
    let url = ''

    // Avoid writing default values to URL querystring
    if (page > 1) {
      url += `?p=${page}`
      parts++
    }

    if (length !== 25) {
      url += `${parts > 0 ? '&' : '?'}length=${length}`
      parts++
    }

    if (sort !== 'id') {
      url += `${parts > 0 ? '&' : '?'}sort_by=${sort}`
      parts++
    }

    if (order !== 'desc') {
      url += `${parts > 0 ? '&' : '?'}order_by=${order}`
      parts++
    }

    this.props.history.push(url)
  }

  fetchGalleries () {
    this.fetchController = new AbortController()
    const rawQuery: RawUrlSortOptions = qs.parse(location.search, { ignoreQueryPrefix: true })
    const query = {
      page: parseInt(rawQuery.p!) || 1,
      sort: rawQuery.sort_by || 'id',
      order: rawQuery.order_by || 'desc',
      length: parseInt(rawQuery.length!) || 25
    }

    const endpoint = `/api/galleries?p=${query.page}&length=${query.length}&sort_by=${query.sort}&order_by=${query.order}`

    fetch(endpoint, { signal: this.fetchController.signal })
      .then(res => res.json())
      .then(registry => this.setState({ query, registry }))
      .catch(err => { if (err.name !== 'AbortError') console.error(err) })
  }

  render () {
    if (!this.state) return null
    const { registry } = this.state
    const { page = Infinity } = this.state.query

    if (page > registry.pages && registry.pages != null) {
      return (
        <span className='error'>
          The requested page exceeds the number of galleries available.
          {registry.pages === 1 ? ' There is only one page.' : ` Page must be between 1 and ${registry.pages}`}
        </span>
      )
    }

    return (
      <>
        <FilterControls onFilter={(sortBy, orderBy, length) => this.changeQuery(1, sortBy, orderBy, length)} />
        <div id='galleries'>
          {
            registry.data.map(gallery => <Preview key={gallery.id} gallery={gallery} />)
          }
        </div>
        <Paginator
          page={page}
          totalPages={registry.pages}
          onPageChange={(page: number) => this.changeQuery(page)}
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

export default withRouter(Galleries)
