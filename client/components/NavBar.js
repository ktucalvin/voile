/* eslint-env browser */
'use strict'
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

class NavBar extends Component {
  gotoSearch () {
    if (this.search.value) {
      this.props.history.push(`/search?s=${this.search.value}`)
      this.search.value = ''
    }
  }

  render () {
    return (
      <nav>
        <a href='/api/random'>Random</a>
        <input
          id='nav-search'
          type='search'
          placeholder='Search...'
          ref={r => (this.search = r)}
          onKeyUp={e => e.key === 'Enter' && this.gotoSearch()}
        />
        <button
          style={{ margin: 0 }}
          onClick={() => this.gotoSearch()}
        >Q
        </button>
      </nav>
    )
  }
}

export default withRouter(NavBar)
