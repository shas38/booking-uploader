import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import './App.css';
import Timeline from './Timeline';
// import uuidv1 from 'uuid/v1';
const apiUrl = 'http://localhost:3001'

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      bookings: [],
    };
  }
  componentDidMount() {
    fetch(`${apiUrl}/bookings`)
      .then((response) => response.json())
      .then((bookings) => {
        this.setState({ bookings })
      })
  }

  onDrop = async acceptedFiles => {
    const reader = new FileReader()

    reader.onabort = () => console.log('file reading was aborted')
    reader.onerror = () => console.log('file reading has failed')
    reader.onload = () => {
      // Do whatever you want with the file contents
      const binaryStr = reader.result
      const newBookings = [];
      let headers;
      binaryStr.trim().split('\n').forEach((line, index)=>{
        // if (!line.replace(/\s/g, '').length)
        //   return
        console.log(line)
        if(index===0){
          headers = line.split(',');
        }
        else{
          const newData = line.split(',');
          const booking = {};
          headers.forEach((header, index)=>{
            if(header.replace(/\s/g,'') === 'duration'){
              booking[header.replace(/\s/g,'')] = parseInt(newData[index].trim()) * 60 * 1000;
            }
            else{
              booking[header.replace(/\s/g,'')] = newData[index].trim();
            }
            
          })
          // booking.id = uuidv1();
          newBookings.push(booking);
        }
      })
      const results = this.findConflitcts(newBookings);
      console.log(results)
      this.setState({bookings: [...this.state.bookings, ...results.bookingsWithoutConflicts] })
      
    }

    acceptedFiles.forEach(file => reader.readAsBinaryString(file))
  }

  findConflitcts = (newBookings) => {
    const conflicts = [];
    const bookingsWithoutConflicts = [];

    newBookings.forEach((newBooking)=>{
      let conflictFound = false;
      this.state.bookings.forEach((oldBooking) => {
        const oldBookingStartTime = new Date(oldBooking.time).getTime();
        const oldBookingEndTime = oldBookingStartTime + oldBooking.duration;
        const newBookingStartTime = new Date(newBooking.time).getTime();
        const newBookingEndTime = newBookingStartTime + newBooking.duration;

        if((newBookingStartTime>=oldBookingStartTime && newBookingStartTime<oldBookingEndTime) || (newBookingEndTime>=oldBookingStartTime && newBookingEndTime<oldBookingEndTime) ){
          conflicts.push([oldBooking, newBooking])
          conflictFound = true;
        }

      })
      if(!conflictFound){
        bookingsWithoutConflicts.push(newBooking);
      }
    })
    return {conflicts, bookingsWithoutConflicts};

  }


  render() {
    console.log(this.state.bookings)
    return (
      <div className="App">
        <div className="App-header">
          <Dropzone
            accept=".csv"
            onDrop={this.onDrop}
          >
            Drag files here
          </Dropzone>
        </div>
        <Timeline 
          bookings={this.state.bookings} 
          
        />
        <div className="App-main">
          <p>Existing bookings:</p>
          {
            (this.state.bookings).map((booking, i) => {
              const date = new Date(booking.time);
              console.log(booking.duration)
              const duration = booking.duration / (60 * 1000);
              return (
                <p key={i} className="App-booking">
                  <span className="App-booking-time">{date.toString()}</span>
                  <span className="App-booking-duration">{duration.toFixed(1)}</span>
                  <span className="App-booking-user">{booking.userId}</span>
                </p>
              )
            })
          }
            {/* {this.state.bookings } */}
          

        </div>
      </div>
    );
  }
}

export default App;
