import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import './App.css';

const apiUrl = 'http://localhost:3001'

class App extends Component {

  state = {}

  componentWillMount() {
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
      const newState = [];
      let headers;
      binaryStr.split('\n').forEach((line, index)=>{
        if (!line.replace(/\s/g, '').length)
          return
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
          newState.push(booking);
        }
      })

      this.setState({bookings: [...this.state.bookings, ...newState] })
      console.log(newState)
    }

    acceptedFiles.forEach(file => reader.readAsBinaryString(file))
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
        <div className="App-main">
          <p>Existing bookings:</p>
          {
            (this.state.bookings || []).map((booking, i) => {
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
        </div>
      </div>
    );
  }
}

export default App;
