'use strict'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
const $ = q => document.querySelector(q)

ReactDOM.render(<App />, $('body'))

document.addEventListener('keyup', e => {
  const $page = $('#reader img')
  if (e.key === 'f' && $page) {
    $page.requestFullscreen()
  } else if (e.key === 'Esc') {
    document.exitFullscreen()
  }
})
