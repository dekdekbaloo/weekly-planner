import React from 'react'
import styles from './Calendar.module.less'
import * as moment from 'moment'
import PropTypes from 'prop-types'
import cx from 'classnames'

function range (from, to) {
  return Array(to + 1 - from).fill().map((x, i) => i + from)
}

function sinerp (from, to, t = 0) {
  const range = to - from
  const angle = t * Math.PI / 2
  return Math.sin(angle) * range + from
}

function smoothScroll (element, to, time) {
  let start
  const animate = () => {
    if (!start) start = Date.now()
    const progress = Date.now() - start
    const target = sinerp(element.scrollTop, to, progress / time)
    element.scrollTo({ top: target })
    if (progress < time && Math.abs(element.scrollTop - to) > 1) {
      window.requestAnimationFrame(animate)
    }
  }
  animate()
  return {
    clear: () => {
      window.cancelAnimationFrame(animate)
    }
  }
}

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
    this.setState({ selectedTime }, () => {
      if (this.smoothScroll) this.smoothScroll.clear()
      this.smoothScroll = smoothScroll(this.calendar, this.activeDateCell.offsetTop - (this.daysOfWeekBar.clientHeight + 45), 1000)
    })
  }

  renderMonthMode = () => (
    <div className={styles.monthMode}>
      <div className={styles.daysOfWeek} ref={ref => { this.daysOfWeekBar = ref }}>
        {range(0, 6).map((d) =>
          <div className={styles.dateCellContainer} key={d}>{moment().day(d).format('dd')}</div>
        )}
      </div>{
        range(0, 11).map((m) => {
          const monthStart = moment()
            .year(this.state.renderedYear)
            .month(m)
            .startOf('month')
            .startOf('week')

          const lastDayInFifthWeek = moment(monthStart)
            .add(4 * 7 + 6, 'days')
          const lastWeekIndex = lastDayInFifthWeek.isBefore(moment().month(m).endOf('month'), 'day')
            ? 5 : 4

          return (
            <div className={styles.monthContainer} key={m}>
              <div className={styles.monthHeader}>
                {moment().month(m).format('YYYY / MMM')}
              </div>
              {range(0, lastWeekIndex).map((w) => (
                <div className={styles.weekContainer} key={w}>
                  {range(0, 6).map((d) => {
                    const renderedTime = moment(monthStart)
                      .add(w * 7 + d, 'days')
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
              ))}
            </div>
          )
        })}
    </div>
  )
  render () {
    return (
      <div className={styles.calendar} ref={ref => { this.calendar = ref }}>
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
