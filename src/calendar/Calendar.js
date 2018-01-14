import React from 'react'
import styles from './Calendar.module.less'
import * as moment from 'moment'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { range } from '../util/array'
import smoothScroll from '../util/smoothScroll'

class Calendar extends React.Component {
  static propTypes = {
    mode: PropTypes.oneOf([ 'year', 'month' ])
  }

  static defaultProps = {
    mode: 'month'
  }

  state = {
    selectedTime: null,
    renderedYear: moment().year()
  }

  selectTime = (selectedTime = moment()) => {
    if (this.state.selectedTime && !selectedTime.diff(this.state.selectedTime)) {
      this.setState({ selectedTime: null })
      return
    }
    this.setState({ selectedTime }, () => {
      if (this.smoothScroll) this.smoothScroll.clear()
      this.smoothScroll = smoothScroll(
        this.calendar,
        this.activeDateCell.offsetTop - (this.daysOfWeekBar.clientHeight + 45),
        1000
      )
    })
  }

  renderMonthMode = () => (
    <div className={styles.monthMode}>
      <div className={styles.daysOfWeek} ref={ref => { this.daysOfWeekBar = ref }}>
        {range(0, 6).map((d) =>
          <div className={styles.dateCellContainer} key={d}>{moment().day(d).format('dd')}</div>
        )}
      </div>
      {range(0, 11).map((m) => {
        const monthStart = moment()
          .year(this.state.renderedYear)
          .month(m)
          .startOf('month')
          .startOf('week')

        const lastDayInFifthWeek = moment(monthStart)
          .add(4 * 7 + 6, 'days')
        const lastWeekIndex = lastDayInFifthWeek
          .isBefore(moment().month(m).endOf('month'), 'day') ? 5 : 4

        return (
          <div className={styles.monthContainer} key={m}>
            <div className={styles.monthHeader}>
              {moment().month(m).format('YYYY / MMM')}
            </div>
            {range(0, lastWeekIndex).map((w) => {
              const weekStart = moment(monthStart).add(w * 7, 'days')
              return (
                <div
                  className={cx(styles.weekContainer, {
                    [styles.inactive]: this.state.selectedTime &&
                        weekStart.week() > this.state.selectedTime.week()
                  })}
                  key={w}
                >
                  {range(0, 6).map((d) => {
                    const renderedTime = moment(weekStart).add(d, 'days')
                    const isOtherMonth = renderedTime.month() !== m
                    const isActive = renderedTime.diff(this.state.selectedTime) === 0
                    return (
                      <div
                        className={cx(styles.dateCellContainer, {
                          [styles.otherMonth]: isOtherMonth,
                          [styles.active]: isActive
                        })}
                        onClick={() => {
                          if (!isOtherMonth) this.selectTime(renderedTime)
                        }}
                        ref={ref => {
                          if (isActive && !isOtherMonth) this.activeDateCell = ref
                        }}
                        key={d}
                      >
                        <div className={styles.date}>{renderedTime.date()}</div>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
  render () {
    return (
      <div
        className={styles.calendar}
        style={{
          overflow: this.state.selectedTime ? 'hidden' : 'auto'
        }}
        ref={ref => { this.calendar = ref }}
      >
        {/* {this.props.mode === 'year' && (
          this.renderYearMode()
        )} */}
        {this.props.mode === 'month' && (
          this.renderMonthMode()
        )}
      </div>
    )
  }
}

export default Calendar
