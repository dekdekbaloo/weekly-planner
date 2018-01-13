import React from 'react'
import styles from './Calendar.module.less'
import * as moment from 'moment'
import PropTypes from 'prop-types'
import cx from 'classnames'
function range (from, to) {
  return Array(to + 1 - from).fill().map((x, i) => i + from)
}

class Calendar extends React.Component {
  static propTypes = {
    mode: PropTypes.oneOf([ 'year', 'month' ])
  }
  static defaultProps = {
    mode: 'month'
  }
  state = {
    year: moment().year()
  }

  renderMonthMode = () => (
    range(0, 11).map((m) => {
      const monthStart = moment()
        .year(this.state.year)
        .month(m)
        .startOf('month')
        .startOf('week')

      const lastDayInFifthWeek = moment(monthStart)
        .add(4 * 7 + 6, 'days')
      const lastWeekIndex = lastDayInFifthWeek.isBefore(moment().month(m).endOf('month'), 'day')
        ? 5 : 4

      return (
        <div className={styles.monthContainer} key={m}>
          {range(0, lastWeekIndex).map((w) => (
            <div className={styles.weekContainer} key={w}>
              {range(0, 6).map((d) => {
                const renderedTime = moment(monthStart)
                  .add(w * 7 + d, 'days')
                return (
                  <div
                    className={cx(styles.dateCellContainer, {
                      [styles.otherMonth]: renderedTime.month() !== m
                    })}
                    key={d}
                  >
                    <div className={styles.date}>{renderedTime.date()}</div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      )
    })
  )
  render () {
    return (
      <div className={styles.calendar}>
        {this.props.mode === 'year' && (
          this.renderYearMode()
        )}
        {this.props.mode === 'month' && (
          this.renderMonthMode()
        )}
      </div>
    )
  }
}

export default Calendar
