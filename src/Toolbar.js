import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  subDays,
  addDays,
  getDate,
  isSameDay,
  isSameMonth,
  isWithinRange
} from 'date-fns'
import { VISIBLE_DAYS, NAVIGATE } from './utils/constants'
import { visibleDaysInterval } from './utils/fns'
import './styles/Toolbar.less'

const WEEK_DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export default class Toolbar extends Component {
  static propTypes = {
    visibleDays: PropTypes.number,
    date: PropTypes.instanceOf(Date).isRequired,
    onNavigate: PropTypes.func.isRequired
  }

  static defaultProps = {
    visibleDays: VISIBLE_DAYS
  }

  state = {
    interval: visibleDaysInterval(this.props.date, this.props.visibleDays)
  }

  handleDateClick = date => {
    const { onNavigate, visibleDays } = this.props
    const interval = this.state.interval
    const isOutOfMonth = !isWithinRange(
      date,
      interval[0],
      interval[interval.length - 1]
    )

    if (isOutOfMonth) {
      this.setState({ interval: visibleDaysInterval(date, visibleDays) })
    }

    onNavigate(NAVIGATE.date, date)
  }

  render() {
    const { date } = this.props
    const { interval } = this.state
    const now = new Date()

    return (
      <div className="rbc-calendar-toolbar">
        <h3>{date.toDateString()}</h3>
        <button onClick={_ => this.handleDateClick(subDays(date, 1))}>
          Previous
        </button>
        <button onClick={_ => this.handleDateClick(now)}>Today</button>
        <button onClick={_ => this.handleDateClick(addDays(date, 1))}>
          Next
        </button>
        <div className="grid">
          {WEEK_DAYS.map((day, idx) => (
            <span key={idx}>{day}</span>
          ))}
          {interval.map(day => (
            <button
              className={
                isSameDay(day, date)
                  ? 'active'
                  : !isSameMonth(day, date)
                  ? 'inactive'
                  : null
              }
              key={day.toString()}
              onClick={_ => this.handleDateClick(day)}
            >
              {getDate(day)}
            </button>
          ))}
        </div>
      </div>
    )
  }
}
