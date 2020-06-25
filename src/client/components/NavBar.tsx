/* eslint-env browser */
'use strict'
import React, { Component } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'

class NavBar extends Component<RouteComponentProps> {
  private search: HTMLInputElement | null = null

  gotoSearch () {
    if (this.search && this.search.value) {
      this.props.history.push(`/search?s=${this.search.value}`)
      this.search.value = ''
    }
  }

  render () {
    return (
      <nav>
        <ul>
          <li>
            <a href='/api/random'>Random</a>
          </li>
          <li>
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
          </li>
        </ul>
      </nav>
    )
  }
}

export default withRouter(NavBar)
