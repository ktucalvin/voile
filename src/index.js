'use strict'
import ReactDOM from 'react-dom'
import './index.css'
import Previews from './Previews'
const $ = q => document.querySelectorAll(q)

ReactDOM.render(<Previews />, $('#galleries')[0])

window.onpopstate = event => {
  const state = event.state
  const $galleries = document.getElementById('galleries')
  const $reader = document.getElementById('reader')
  if (state && state.isReading) {
    $reader.style.display = 'block'
    $galleries.style.display = 'none'
  } else {
    $reader.style.display = 'none'
    $galleries.style.display = 'block'
  }
}
