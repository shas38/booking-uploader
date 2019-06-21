import React, {Fragment}from 'react';
import 'react-calendar-timeline/lib/Timeline.css'
import Timeline from 'react-calendar-timeline'
import moment from 'moment'

const DateForm = (props) => {

    const groups = [{ id: 1, title: 'Conflict 1' }, { id: 2, title: 'Conflict 2' }]

    const items = [];

    props.conflicts.forEach((item, index) => {

        items.push({
            id: index,
            group: 1,
            title: index,
            start_time: moment(new Date(item[0].time)),
            end_time: moment(new Date(item[0].time)).add(item[0].duration, 'ms')
        })
        items.push({
            id: index+props.conflicts.length,
            group: 2,
            title: index+props.conflicts.length,
            start_time: moment(new Date(item[1].time)),
            end_time: moment(new Date(item[1].time)).add(item[1].duration, 'ms')
        })
    });

    const startTime = new Date(props.conflicts[0][0].time);
    return (
        <Fragment>
            <h1>Conflicts (Australian Eastern Daylight Time)</h1>
            <p style={{color: "red", fontSize:"1.5rem"}}>{props.conflicts.length+ " conflicts were found!"}</p>
            <Timeline
                groups={groups}
                items={items}
                defaultTimeStart={moment(startTime)}
                defaultTimeEnd={moment(startTime).add(12, 'hour')}
            />
        </Fragment>
    )
}

export default DateForm;
