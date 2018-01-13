import React from 'react'
import PropTypes from 'prop-types'
import { NavBar, Icon } from 'antd-mobile'

class BottomPane extends React.Component {
  static propTypes = {
    title: PropTypes.any,
    visible: PropTypes.bool,
    children: PropTypes.node,
    onClose: PropTypes.func
  }
  static defaultProps = {
    onClose: () => { }
  }
  state = { fullscreen: false }
  componentWillReceiveProps (nextProps) {
    if (nextProps.visible === false) {
      this.setState({ fullscreen: false })
    }
  }

  toggleFullScreen = () => {
    this.setState({ fullscreen: !this.state.fullscreen })
  }
  render () {
    return (
      <div
        className='app__bottom-pane'
        style={{
          height: this.state.fullscreen ? '100vh' : '50vh',
          background: 'white',
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          zIndex: 1000,
          transform: `translate3d(0, ${this.props.visible ? 0 : '100%'}, 0)`,
          opacity: this.props.visible ? 1 : 0,
          transition: 'all 0.2s, transform 0.2s, opacity 0.3s',
          boxShadow: '0 0 2.5px 0 rgba(0, 0, 0, 0.2)'
        }}
      >
        <NavBar
          mode='light'
          leftContent={<Icon type='cross' onClick={this.props.onClose} />}
          rightContent={<span onClick={this.toggleFullScreen}>{this.state.fullscreen ? 'Collapse' : 'Expand'}</span>}
        >
          {this.props.title}
        </NavBar>
        <div style={{ height: 'calc(100% - 45px)', overflow: 'auto' }}>
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default BottomPane
