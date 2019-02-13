import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  isSameDay,
  subDays,
  addDays,
  getDate,
  isSameMonth,
  isWithinRange,
  format,
  subYears,
  addYears,
  isSameYear,
  startOfYear
} from 'date-fns'
import classNames from 'classnames'
import { VISIBLE_DAYS, NAVIGATE, VIEWS } from './utils/constants'
import { visibleDaysInterval, eachMonth, eachYear } from './utils/fns'
import './styles/Toolbar.less'

/**
 * Week days initials.
 */
const WEEK_DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export default class Toolbar extends Component {
  static propTypes = {
    /**
     * The title of the toolbar.
     */
    title: PropTypes.string,
    /**
     * How many dates are going to be visible in the toolbar.
     */
    visibleDays: PropTypes.number,
    /**
     * Current calendar date. Passed by the calendar component.
     */
    date: PropTypes.instanceOf(Date).isRequired,
    /**
     * Callback to navigates between dates.
     */
    onNavigate: PropTypes.func.isRequired
  }

  static defaultProps = {
    title: '',
    visibleDays: VISIBLE_DAYS
  }

  getInterval = (date, view) => {
    const intervals = {
      [VIEWS.day]: visibleDaysInterval(date, this.props.visibleDays),
      [VIEWS.month]: eachMonth(startOfYear(date), 12),
      [VIEWS.year]: eachYear(startOfYear(date), 12)
    }

    return intervals[view]
  }

  state = {
    view: VIEWS.day,
    interval: this.getInterval(this.props.date, VIEWS.day)
  }

  changeView = () => {
    this.setState(({ view }) => {
      const views = [VIEWS.day, VIEWS.month, VIEWS.year]
      const nextViewIdx = views.findIndex(v => v === view) + 1
      const nextView = views[nextViewIdx] || views[0]

      return {
        view: nextView,
        interval: this.getInterval(this.props.date, nextView)
      }
    })
  }

  handleDateClick = date => {
    const interval = this.state.interval
    const isOutOfMonth = !isWithinRange(
      date,
      interval[0],
      interval[interval.length - 1]
    )

    if (isOutOfMonth) {
      this.setState({ interval: this.getInterval(date, VIEWS.day) })
    }

    this.props.onNavigate(NAVIGATE.date, date)
  }

  handleMonthClick = date => {
    this.setState({
      view: VIEWS.day,
      interval: this.getInterval(date, VIEWS.day)
    })

    this.props.onNavigate(NAVIGATE.date, date)
  }

  handleYearClick = date => {
    this.setState({
      view: VIEWS.month,
      interval: this.getInterval(date, VIEWS.month)
    })
  }

  getTitle = view => {
    if (this.props.title) {
      return this.props.title
    }

    const titles = {
      [VIEWS.day]: format(this.props.date, 'MMMM YYYY'),
      [VIEWS.month]: format(this.state.interval[0], 'YYYY'),
      [VIEWS.year]: `${format(this.state.interval[0], 'YYYY')} - ${format(
        this.state.interval[this.state.interval.length - 1],
        'YYYY'
      )}`
    }

    return titles[view]
  }

  handlePreviousClick = () => {
    const { view } = this.state
    if (view === VIEWS.day) {
      this.handleDateClick(subDays(this.props.date, 1))
    } else if (view === VIEWS.month) {
      this.setState(currentState => {
        const interval = this.getInterval(
          subYears(currentState.interval[0], 1),
          view
        )

        return { interval }
      })
    } else if (view === VIEWS.year) {
      this.setState(currentState => {
        const interval = this.getInterval(
          subYears(currentState.interval[0], 12),
          view
        )

        return { interval }
      })
    }
  }

  handleNextClick = () => {
    const { view } = this.state
    if (view === VIEWS.day) {
      this.handleDateClick(addDays(this.props.date, 1))
    } else if (view === VIEWS.month) {
      this.setState(currentState => {
        const interval = this.getInterval(
          addYears(currentState.interval[0], 1),
          view
        )

        return { interval }
      })
    } else if (view === VIEWS.year) {
      this.setState(currentState => {
        const interval = this.getInterval(
          addYears(currentState.interval[0], 12),
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
              className={classNames({
                active: isSameDay(day, date),
                inactive: !isSameMonth(day, date)
              })}
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
          {interval.map(day => (
            <button
              key={day}
              onClick={_ => this.handleMonthClick(day)}
              className={classNames({ active: isSameMonth(day, date) })}
            >
              {format(day, 'MMM')}
            </button>
          ))}
        </div>
      ),
      [VIEWS.year]: (
        <div className="grid month-grid">
          {interval.map(day => (
            <button
              key={day}
              onClick={_ => this.handleYearClick(day)}
              className={classNames({ active: isSameYear(day, date) })}
            >
              {format(day, 'YYYY')}
            </button>
          ))}
        </div>
      )
    }

    return (
      <div className="rbc-calendar-toolbar">
        <button onClick={this.handlePreviousClick}>Previous</button>
        <button onClick={this.changeView}>{this.getTitle(view)}</button>
        <button onClick={this.handleNextClick}>Next</button>
        <button onClick={_ => this.handleDateClick(now)}>Today</button>
        {views[view]}
      </div>
    )
  }
}
