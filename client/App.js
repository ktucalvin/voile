'use strict'
/* eslint-env browser */
import { hot } from 'react-hot-loader/root'
import React, { Component } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Galleries from './pages/Galleries'
import Overview from './pages/Overview'
import Reader from './pages/Reader'
import SearchResults from './pages/SearchResults'
import NavBar from './components/NavBar'
import NotFound from './components/NotFound'

class App extends Component {
  render () {
    return (
      <>
        <BrowserRouter>
          <header>
            <a href='/'>
              <span className='app-name'><b>𝕍</b>oile</span>
            </a>
            <NavBar />
          </header>
          <main>
            <Switch>
              <Route exact path='/' component={Galleries} />
              <Route exact path='/search' component={SearchResults} />
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
