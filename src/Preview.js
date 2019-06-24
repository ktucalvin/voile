/* eslint-env browser */
'use strict'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class Preview extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <div className='preview'>
        <Link to={`/g/${this.props.src}/1`}>
          {this.state.src ? <img src={this.state.src} /> : <i class='loader' />}
          <span>{this.props.title}</span>
        </Link>
      </div>
    )
  }

  componentDidMount () {
    const { ext } = this.props
    let src
    if (ext === '.jpg' || ext === '.png' || ext === '.jpeg') {
      src = '/i/' + this.props.src + '/1?w=225'
    } else {
      src = '/g/' + this.props.src + '/1' + ext
    }
    const img = new Image()
    img.onload = () => {
      this.setState({ src })
    }
    img.src = src
  }
}

export default Preview
