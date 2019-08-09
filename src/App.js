'use strict'
import './index.css'
import { hot } from 'react-hot-loader/root'
import React, { Component } from 'react'
import { BrowserRouter, Route, Link } from 'react-router-dom'
import Galleries from './pages/Galleries'
import Overview from './pages/Overview'
import Reader from './pages/Reader'

class App extends Component {
  render () {
    return (
      <>
        <BrowserRouter>
          <header>
            <Link to='/' id='logo'>
              <span className='app-name'><b>𝕍</b>oile</span>
            </Link>
          </header>
          <main>
            <Route exact path='/' component={Galleries} />
            <Route exact path='/g/:id/' component={Overview} />
            <Route exact path='/g/:id/:page/' component={Reader} />
          </main>
        </BrowserRouter>
      </>
    )
  }
}

export default hot(App)
