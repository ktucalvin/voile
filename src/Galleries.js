/* eslint-env browser */
'use strict'
import React, { Component } from 'react'
import Preview from './Preview'
import Paginator from './Paginator'

class Galleries extends Component {
  constructor (props) {
    super(props)
    const queryPage = /\?p=(\d+)/.exec(this.props.location.search)
    let page = 1
    if (queryPage && queryPage[1] && parseInt(queryPage[1])) {
      page = parseInt(queryPage[1])
    }

    this.changePage = this.changePage.bind(this)
    this.state = { page }
  }

  changePage (page) {
    fetch(`/api/registry/${page}`)
      .then(res => res.json())
      .then(registry => {
        this.props.history.push(`?p=${page}`)
        this.setState({ page, registry })
      })
  }

  render () {
    if (!this.state.registry) return null
    const { registry } = this.state
    const { data } = registry
    if (this.state.page > registry.totalSize) {
      return (<span class='error'>The requested page exceeds the number of galleries available. Page must be between 1 and {registry.totalSize}.</span>)
    }

    let result = []
    for (const gallery of data) {
      result.push(
        <Preview
          key={gallery.id}
          src={gallery.id}
          title={gallery.name}
          totalPages={gallery.totalPages}
          ext={gallery.ext || gallery.extdecoder[gallery.extstring.charAt(0)]}
        />
      )
    }
    return (
      <main>
        <div id='galleries'>
          {result}
        </div>
        <Paginator page={this.state.page} totalPages={registry.totalSize} onPageChange={this.changePage} />
      </main>
    )
  }

  componentDidMount () {
    fetch(`/api/registry/${this.state.page}`)
      .then(res => res.json())
      .then(registry => {
        this.setState({ registry })
      })
  }
}

export default Galleries
