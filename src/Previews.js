/* eslint-env browser */
'use strict'
import React, { Component } from 'react'
import Preview from './Preview'

class Previews extends Component {
  render () {
    if (!this.state) return null
    let result = []
    for (const id in this.state) {
      const gallery = this.state[id][1]
      result.push(<Preview src={gallery.folder} title={gallery.name} totalPages={gallery.totalPages} />)
    }
    return (
      <div id='galleries'>
        {result}
      </div>
    )
  }

  componentDidMount () {
    fetch('/api/registry')
      .then(res => res.json())
      .then(registry => {
        this.setState(registry)
      })
  }
}

export default Previews
