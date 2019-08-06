'use strict'
import './index.css'
import { hot } from 'react-hot-loader/root'
import React, { Component } from 'react'
import { BrowserRouter, Route, Link } from 'react-router-dom'
import Galleries from './Galleries'
import Reader from './Reader'

class App extends Component {
  render () {
    return (
      <>
        <BrowserRouter>
          <header>
            <Link to='/' id='logo'>
              <span class='app-name'><b>𝕍</b>oile</span>
            </Link>
          </header>
          <Route exact path='/' component={Galleries} />
          <Route path='/g/:id/:page/' component={Reader} />
        </BrowserRouter>
      </>
    )
  }
}

export default hot(App)
