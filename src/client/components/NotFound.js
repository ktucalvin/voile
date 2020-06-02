'use strict'
import React from 'react'
import { Link } from 'react-router-dom'

export default () => (
  <>
    <p className='notfound'>
    404 - Page not found.
    </p>
    <Link to='/'>Return to home.</Link>
  </>
)
