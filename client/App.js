'use strict'
/* eslint-env browser */
import { hot } from 'react-hot-loader/root'
import React, { Component } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Galleries from './pages/Galleries'
import Overview from './pages/Overview'
import Reader from './pages/Reader'
import NavBar from './components/NavBar'
import NotFound from './components/NotFound'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {}
    this.handleQueryChange = this.handleQueryChange.bind(this)
    this.searchTimeout = 0
  }

  handleQueryChange () {
    clearTimeout(this.searchTimeout)
    this.searchTimeout = setTimeout(() =>
      this.setState({ query: document.getElementById('search').value }), 250)
  }

  render () {
    return (
      <>
        <BrowserRouter>
          <header>
            <a href='/'>
              <span className='app-name'><b>𝕍</b>oile</span>
            </a>
            <NavBar />
            <Route exact path='/' render={() => (<input id='search' type='search' placeholder='Search...' onChange={this.handleQueryChange} />)} />
          </header>
          <main>
            <Switch>
              <Route exact path='/' render={() => <Galleries query={this.state.query} />} />
              <Route exact path='/g/:id/' component={Overview} />
              <Route path='/g/:id/:chapter/:page/' component={Reader} />
              <Route component={NotFound} />
            </Switch>
          </main>
        </BrowserRouter>
      </>
    )
  }
}

export default hot(App)
