import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  subDays,
  addDays,
  getDate,
  isSameDay,
  isSameMonth,
  isWithinRange,
  format,
  subYears
} from 'date-fns'
import { VISIBLE_DAYS, NAVIGATE, VIEWS } from './utils/constants'
import { visibleDaysInterval, eachMonth } from './utils/fns'
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

  intervalFromView = (date, view) => {
    const intervals = {
      [VIEWS.day]: visibleDaysInterval(date, this.props.visibleDays),
      [VIEWS.month]: eachMonth(date, 12)
    }

    return intervals[view]
  }

  state = {
    view: VIEWS.day,
    interval: this.intervalFromView(this.props.date, VIEWS.day)
  }

  changeView = () => {
    this.setState(currentState => {
      const view = currentState.view
      const views = [VIEWS.day, VIEWS.month /**, VIEWS.year */]
      const nextViewIdx = views.findIndex(v => v === view) + 1
      const nextView = views[nextViewIdx] || views[0]

      return {
        view: nextView,
        interval: this.intervalFromView(this.props.date, nextView)
      }
    })
  }

  handleDateClick = date => {
    const { onNavigate } = this.props
    const interval = this.state.interval
    const isOutOfMonth = !isWithinRange(
      date,
      interval[0],
      interval[interval.length - 1]
    )

    if (isOutOfMonth) {
      this.setState({ interval: this.intervalFromView(date, VIEWS.day) })
    }

    onNavigate(NAVIGATE.date, date)
  }

  handleMonthClick = date => {
    this.setState({
      view: VIEWS.day,
      interval: this.intervalFromView(date, VIEWS.day)
    })
  }

  intervalTitle = view => {
    const titles = {
      [VIEWS.day]: format(this.props.date, 'MMMM YYYY'),
      [VIEWS.month]: format(this.state.interval[0], 'YYYY')
    }

    return titles[view]
  }

  handlePreviousClick = () => {
    const { view } = this.state
    if (view === VIEWS.day) {
      this.handleDateClick(subDays(this.props.date, 1))
    } else if (view === VIEWS.month) {
      this.setState(currentState => {
        const interval = this.intervalFromView(
          subYears(currentState.interval[0], 1),
          view
        )

        return { interval }
      })
    }
  }

  render() {
    const { date } = this.props
    const { interval, view } = this.state
    const now = new Date()

    const views = {
      [VIEWS.day]: (
        <div className="grid day-grid">
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
      ),
      [VIEWS.month]: (
        <div className="grid month-grid">
          {interval.map(date => (
            <button key={date} onClick={_ => this.handleMonthClick(date)}>
              {format(date, 'MMM')}
            </button>
          ))}
        </div>
      )
    }

    return (
      <div className="rbc-calendar-toolbar">
        <button onClick={this.changeView}>{this.intervalTitle(view)}</button>
        <button onClick={_ => this.handlePreviousClick()}>Previous</button>
        <button onClick={_ => this.handleDateClick(now)}>Today</button>
        <button onClick={_ => this.handleDateClick(addDays(date, 1))}>
          Next
        </button>
        {views[view]}
      </div>
    )
  }
}
