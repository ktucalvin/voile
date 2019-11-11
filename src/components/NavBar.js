/* eslint-env browser */
'use strict'
import React from 'react'
import { withRouter } from 'react-router-dom'

function gotoRandomGallery (history) {
  fetch('/api/random')
    .then(res => res.text())
    .then(id => {
      document.location = `/g/${id}`
    })
}

export default withRouter(({ history }) => (
  <nav>
    <li onClick={() => gotoRandomGallery(history)}>Random</li>
  </nav>
))
