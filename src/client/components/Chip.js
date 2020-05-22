/* eslint-env browser */
'use strict'
import React from 'react'

export default ({ color, text }) => (
  <span className='chip' style={{ backgroundColor: color }}>{text}</span>
)
