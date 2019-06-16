'use strict'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
const $ = q => document.querySelectorAll(q)

ReactDOM.render(<App />, $('body')[0])

document.addEventListener('keyup', e => {
  const $page = $('#reader img')[0]
  if (e.key === 'f' && $page) {
    $page.requestFullscreen()
  } else if (e.key === 'Esc') {
    document.exitFullscreen()
  }
})
