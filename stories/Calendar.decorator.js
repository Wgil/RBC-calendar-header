import React from 'react'
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
const localizer = BigCalendar.momentLocalizer(moment) // or globalizeLocalizer

export default class App extends React.Component {
  state = {
    date: new Date()
  }

  handleDateChange = date => this.setState({ date })

  render() {
    const { date } = this.state

    return (
      <div style={{ height: '100vh' }}>
        <BigCalendar
          date={date}
          onNavigate={(date, view, action) => {
            this.handleDateChange(date)
          }}
          localizer={localizer}
          events={[
            { title: 'Hello World', start: new Date(), end: new Date() }
          ]}
          components={{
            toolbar: props =>
              React.cloneElement(this.props.story(), { ...props })
          }}
        />
      </div>
    )
  }
}
