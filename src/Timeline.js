import React from 'react';
import 'react-calendar-timeline/lib/Timeline.css'
import Timeline from 'react-calendar-timeline'
import moment from 'moment'

const DateForm = (props) => {
    const groups = [{ id: 1, title: 'group 1' }, { id: 2, title: 'group 2' }]
    // const items = [
    //   {
    //     id: 1,
    //     group: 1,
    //     title: 'item 1',
    //     start_time: moment(10800000),
    //     end_time: moment(10800000).add(1, 'hour')
    //   },
    //   {
    //     id: 2,
    //     group: 2,
    //     title: 'item 2',
    //     start_time: moment(10700000).add(-0.5, 'hour'),
    //     end_time: moment(10700000).add(0.5, 'hour')
    //   },
    //   {
    //     id: 3,
    //     group: 1,
    //     title: 'item 3',
    //     start_time: moment().add(2, 'hour'),
    //     end_time: moment().add(3, 'hour')
    //   }
    // ]
    // const items = []
    const items = props.bookings.map((booking, index) => {
        return {
            id: index,
            group: 1,
            title: index,
            start_time: moment(new Date(booking.time)),
            end_time: moment(new Date(booking.time)).add(booking.duration, 'ms')
        }
    })
    const startTime = props.bookings.length>0? new Date(props.bookings[0].time) : new Date("1 Mar 2018 11:00:00 GMT+1000");
    console.log({start: props.startTime})
    return (
        <div>
            Rendered by react!
            
     
            <Timeline
                groups={groups}
                items={items}
                defaultTimeStart={moment(startTime)}
                defaultTimeEnd={moment(startTime).add(12, 'hour')}
            />
        

        </div>
    )
}
// Export the component as the default object
export default DateForm;
