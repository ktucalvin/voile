/* eslint-env browser */
'use strict'
import React, { Component } from 'react'
import Preview from './Preview'
import Paginator from './Paginator'

class Galleries extends Component {
  constructor (props) {
    super(props)
    this.changePage = this.changePage.bind(this)
    this.state = {
      page: 1
    }
  }

  changePage (page) {
    fetch(`/api/registry/${page}`)
      .then(res => res.json())
      .then(registry => {
        this.setState({ page, registry })
      })
  }

  render () {
    if (!this.state.registry) return null
    const { registry } = this.state
    const { data } = registry
    let result = []
    for (const gallery of data) {
      result.push(<Preview key={gallery.id} src={gallery.id} title={gallery.name} totalPages={gallery.totalPages} ext={gallery.ext} />)
    }
    return (
      <main>
        <div id='galleries'>
          {result}
          <Paginator page={this.state.page} totalPages={registry.totalSize} onPageChange={this.changePage} />
        </div>
      </main>
    )
  }

  componentDidMount () {
    fetch(`/api/registry/1`)
      .then(res => res.json())
      .then(registry => {
        this.setState({ registry })
      })
  }
}

export default Galleries
