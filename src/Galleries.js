/* eslint-env browser */
'use strict'
import React, { Component } from 'react'
import Preview from './Preview'
import Paginator from './Paginator'

class Galleries extends Component {
  constructor (props) {
    super(props)
    this.changePage = this.changePage.bind(this)
  }

  changePage (page) {
    fetch(`/api/registry/${page}`)
      .then(res => res.json())
      .then(registry => {
        this.setState({ registry })
      })
  }

  render () {
    if (!this.state) return null
    const { registry } = this.state
    const { portion } = registry
    let result = []
    for (const entry of portion) {
      const gallery = entry[1]
      result.push(<Preview key={gallery.id} src={gallery.id} title={gallery.name} totalPages={gallery.totalPages} ext={gallery.ext} />)
    }
    return (
      <>
        {result}
        <Paginator totalPages={registry.totalSize} onPageChange={this.changePage} />
      </>
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
