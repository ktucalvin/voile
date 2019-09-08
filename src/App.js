'use strict'
/* eslint-env browser */
import { hot } from 'react-hot-loader/root'
import React, { Component } from 'react'
import { BrowserRouter, Route, Link } from 'react-router-dom'
import Galleries from './pages/Galleries'
import Overview from './pages/Overview'
import Reader from './pages/Reader'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {}
    this.updateQuery = this.updateQuery.bind(this)
  }

  updateQuery () {
    this.setState({ query: document.getElementById('search').value })
  }

  render () {
    return (
      <>
        <BrowserRouter>
          <header>
            <Link to='/'>
              <span className='app-name'><b>𝕍</b>oile</span>
            </Link>
            <Route exact path='/' render={() =>
              (<input id='search' type='search' placeholder='Search...' onChange={this.updateQuery} />)}
            />
          </header>
          <main>
            <Route exact path='/' render={() => <Galleries query={this.state.query} />} />
            <Route exact path='/g/:id/' component={Overview} />
            <Route path='/g/:id/:chapter/:page/' component={Reader} />
          </main>
        </BrowserRouter>
      </>
    )
  }
}

export default hot(App)
