import React, {Fragment}from 'react';
import 'react-calendar-timeline/lib/Timeline.css'
import Timeline from 'react-calendar-timeline'
import moment from 'moment'

const DateForm = (props) => {
    const groups = [{ id: 1, title: 'Bookings' }]

    const items = props.bookings.map((booking, index) => {
        return {
            id: index,
            group: 1,
            title: index,
            start_time: moment(new Date(booking.time)),
            end_time: moment(new Date(booking.time)).add(booking.duration, 'ms')
        }
    })
    const startTime = new Date(props.bookings[0].time);
    return (
        <Fragment>
            <h2>Current Bookings</h2>
            <Timeline
                groups={groups}
                items={items}
                defaultTimeStart={moment(startTime)}
                defaultTimeEnd={moment(startTime).add(12, 'hour')}
            />
        </Fragment>
    )
}
// Export the component as the default object
export default DateForm;
