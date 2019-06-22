import React, { Component, Fragment } from 'react';
import Dropzone from 'react-dropzone';
import './App.css';
import Timeline from './Timeline';
import OverlappedTimeline from './OverlappedTimeline';
import Loader from './loader';

const apiUrl = 'http://localhost:3001'

class App extends Component {

  // Constructor was added later for initialising the state
  constructor(props) {
    super(props);
    this.state = {
      bookings: [],
      conflicts: [],
      isError: false,
      error: '',
      loading: false,
    };
  }

  // Converted callbacks to async/await
  componentDidMount = async () => {
    try{
      await this.setState({
        loading: true,
      })
      const result = await fetch(`${apiUrl}/bookings`)
      const resultBody = await result.json()

      this.setState({
        bookings: resultBody,
        isError: false,
        loading: false,
      })
 
    }
    catch(err){
      this.setState({
        error: err,
        isError: true,
        loading: false,
      })
    }
  }

  onDrop = async acceptedFiles => {

    const reader = new FileReader()
    reader.onabort = () => console.log('file reading was aborted')
    reader.onerror = () => console.log('file reading has failed')
    reader.onload = async () => {

      const binaryStr = reader.result
      const newBookings = [];
      let headers;
      binaryStr.trim().split('\n').forEach((line, index)=>{

        if(index===0){
          // Extract the headers and their position
          headers = line.split(',');
        }
        else{
          const newData = line.split(',');
          const booking = {};
          headers.forEach((header, index)=>{
            if(header.replace(/\s/g,'') === 'duration'){
              booking[header.replace(/\s/g,'')] = parseInt(newData[index].trim(), 10) * 60 * 1000;
            }
            else{
              booking[header.replace(/\s/g,'')] = newData[index].trim();
            }
            
          })
          newBookings.push(booking);
        }
      })
      
      const results = this.findConflitcts(newBookings);

      try{
        const result = await fetch(`${apiUrl}/bookings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(results.bookingsWithoutConflicts),
        });
        const resultBody = await result.json()

        this.setState({
          bookings: resultBody,
          conflicts: results.conflicts,
          isError: false,
        })
      }
      catch(err){
        console.log(err)
        this.setState({
          error: err,
          isError: true,
        })
      }   
    }

    acceptedFiles.forEach(file => reader.readAsBinaryString(file))
  }

  // Method for finding conflicts between existing bookings and new bookings.
  // Please note this function does not check conflicts between all the new bookings.
  // An assumption was made that the user will check and make sure that there are no conflicts between the new bookings.
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

        if((newBookingStartTime<=oldBookingStartTime && newBookingEndTime>=oldBookingEndTime) || (newBookingStartTime>=oldBookingStartTime && newBookingStartTime<oldBookingEndTime) || (newBookingEndTime>=oldBookingStartTime && newBookingEndTime<oldBookingEndTime) ){
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
          {this.state.bookings.length>0 && (
              <Timeline 
                bookings={this.state.bookings}         
              />
          )}
          {this.state.conflicts.length > 0 && (
              <OverlappedTimeline 
                conflicts={this.state.conflicts}         
              />
          )}
          {this.state.isError && <h2 style={{color: "red"}}>{this.state.error.message}</h2>}
        </div>
        
    );
  }
}

export default App;
