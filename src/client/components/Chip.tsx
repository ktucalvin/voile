/* eslint-env browser */
'use strict'
import React from 'react'

interface ChipProps {
  color: string,
  text: string
}

const Chip = ({ color, text }: ChipProps) => (
  <span className='chip' style={{ backgroundColor: color }}>{text}</span>
)

Chip.displayName = 'chip'

export default Chip
