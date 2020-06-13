/* eslint-env browser */
'use strict'
import React, { Component } from 'react'

interface WidthObservingComponentState {
  width: number
}

export interface WidthObservingComponentProps {
  width?: number
}

function withWidth<P extends object> (WrappedComponent, breakpoints) {
  return class extends Component<P, WidthObservingComponentState> {
    constructor (props) {
      super(props)
      this.state = { width: window.innerWidth }
      this.updateWidth = this.updateWidth.bind(this)
    }

    updateWidth () {
      for (const breakpoint of breakpoints) {
        // check if resize is on opposite sides of breakpoint
        if ((window.innerWidth <= breakpoint) === (this.state.width > breakpoint)) {
          this.setState({ width: window.innerWidth })
          return
        }
      }
    }

    render () {
      return (<WrappedComponent width={this.state.width} {...this.props} />)
    }

    componentDidMount () {
      window.addEventListener('resize', this.updateWidth)
    }

    componentWillUnmount () {
      window.removeEventListener('resize', this.updateWidth)
    }
  }
}

export default withWidth