import React from 'react'
import Layout from './layout/Layout'
import BottomPane from './layout/BottomPane'
import Calendar from './calendar/Calendar'
import * as moment from 'moment'
import { List, Checkbox, TextareaItem } from 'antd-mobile'

class App extends React.Component {
  state = {
    selectedDate: null,
    shouldShowCalendar: false,
    shouldShowBottomPane: false
  }
  toggleCalendar = () => {
    this.setState({ shouldShowCalendar: !this.state.shouldShowCalendar })
  }
  openBottomPane = () => {
    this.setState({ shouldShowBottomPane: true })
  }
  closeBottomPane = () => {
    this.setState({ shouldShowBottomPane: false })
  }
  selectDate = (value) => {
    this.setState({ selectedDate: moment(value) })
    this.openBottomPane()
  }
  render () {
    return (
      <Layout>
        <Calendar onSelect={this.selectDate} />
        <BottomPane
          title='Week plan'
          visible={this.state.shouldShowBottomPane}
          onClose={this.closeBottomPane}
        >
          {this.state.selectedDate && Array(7).fill().map((x, i) => (
            <List renderHeader={() => this.state.selectedDate.day(i).format('dddd D MMM')} key={i}>
              <TextareaItem title={<Checkbox />} defaultValue='deez dooz' autoHeight />
            </List>
          ))}
        </BottomPane>
      </Layout>
    )
  }
}

export default App
