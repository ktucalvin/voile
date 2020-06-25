/* eslint-env browser */
'use strict'
import React from 'react'

interface ChipProps {
  color: string,
  text: string
}

export default ({ color, text }: ChipProps) => (
  <span className='chip' style={{ backgroundColor: color }}>{text}</span>
)
