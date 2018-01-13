import React from 'react'
import { Flex, NavBar } from 'antd-mobile'
import PropTypes from 'prop-types'

class Layout extends React.Component {
  static propTypes = {
    children: PropTypes.node
  }
  render () {
    return (
      <Flex
        direction='column'
        align='stretch'
        style={{
          position: 'relative',
          maxHeight: '100vh',
          overflow: 'hidden'
        }}
      >
        <Flex.Item>
          <NavBar mode='dark'>
            Weekly Planner
          </NavBar>
        </Flex.Item>
        <div style={{ height: 'calc(100vh - 45px)', overflow: 'auto' }}>
          {this.props.children}
        </div>
      </Flex>
    )
  }
}

export default Layout
