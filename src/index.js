'use strict'
import 'react-hot-loader'
import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
const $ = q => document.querySelector(q)

ReactDOM.render(<App />, $('#root'))

document.addEventListener('keyup', e => {
  const $page = $('#reader img')
  if (e.key === 'f' && $page) {
    $page.requestFullscreen()
  } else if (e.key === 'Esc') {
    document.exitFullscreen()
  }
})
