/* eslint-env browser */
'use strict'
import React from 'react'
import Chip from './Chip'
const tagTypes = ['language', 'category', 'group', 'artist', 'parody', 'character', 'content']
const tagColors = ['#0063b1', '#038387', '#b146c2', '#27ae60', '#e74c3c', '#e67e22', '#ea005e']

export default ({ tags }) => (
  <div className='tagbox'>
    {
      tagTypes
        .map((type, i) => {
          if (tags[type]) {
            return tags[type].map(e => <Chip key={`${type}-${e}`} text={e} color={tagColors[i]} />)
          }
        })
        .reduce((s, i) => s.concat(i), [])
    }
  </div>
)
