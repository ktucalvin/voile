/* eslint-env browser */
'use strict'
import React, { Component } from 'react'
import Preview from './Preview'
import Paginator from './Paginator'
const queryPageRegex = /\?p=(\d+)/

class Galleries extends Component {
  constructor (props) {
    super(props)
    this.changePage = this.changePage.bind(this)
  }

  changePage (location = this.props.location.search) {
    const queryPage = queryPageRegex.exec(location)
    const page = (queryPage && parseInt(queryPage[1])) || 1
    this.fetchController = new AbortController()
    fetch(`/api/registry/${page}`, { signal: this.fetchController.signal })
      .then(res => res.json())
      .then(registry => this.setState({ page, registry }))
      .catch(err => { if (err.name !== 'AbortError') console.error(err) })
  }

  render () {
    if (!this.state) return null
    const { registry } = this.state
    if (this.state.page > registry.totalSize) {
      return (
        <span className='error'>
          The requested page exceeds the number of galleries available.
          Page must be between 1 and {registry.totalSize}.
        </span>
      )
    }

    let result = []
    for (const gallery of registry.data) {
      result.push(<Preview key={gallery.id} gallery={gallery} />)
    }

    return (
      <>
        <div id='galleries'>
          {result}
        </div>
        <Paginator
          page={this.state.page}
          totalPages={registry.totalSize}
          onPageChange={page => this.props.history.push(`?p=${page}`)}
        />
      </>
    )
  }

  componentDidMount () {
    document.title = 'Voile'
    this.changePage()
    // Must pass new location immediately since it takes time before it is updated in this.props
    this.unlisten = this.props.history.listen(location => this.changePage(location.search))
  }

  shouldComponentUpdate (prevProps) {
    // !== implies only location has changed, not that changePage fetched new data
    return prevProps.location === this.props.location
  }

  componentWillUnmount () {
    this.unlisten()
    this.fetchController.abort()
  }
}

export default Galleries
