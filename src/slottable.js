import React from 'react';


class SlotTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = {disabled: false};
  }

  convertUTCToLocalTime = (dateString) => {
    let date = new Date(dateString);
    const milliseconds = Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
    );
    const localTime = new Date(milliseconds);
    return localTime;
  };

  onBook = (slotID) => {
    const current = this;
    if (this.state.disabled) {
      return;
    }
    this.setState({disabled: true});

    (async function () {      
      var text = null;
      const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slotID: slotID, userID: current.props.userID, serviceID: current.props.serviceChoice })
      };
      //const url = 'http://localhost:7075';
      const url = 'https://rasputintmfaappointmentservice.azurewebsites.net';
      await fetch(url + '/api/CreateAppointment', requestOptions)
            .then(response => { 
              console.log("Response: ", response);
              current.setState({disabled: false});
              if (response.status >= 400 && response.status < 600) {
                current.setState({ error: response.statusText});
              }
              return response.json(); 
            } )
            .then(json => { text = json; } )
            .catch(error => { console.log("Error: ", error); });
            if (text !== null) {
                current.setState({ error: ''});
                console.log(text);
                current.setState({timeslot: new Date()});
            }
    })();
  }  

  render() {
      return (
          <table className="styled-table">
            <caption>Available slots</caption>
            <thead>
              <tr>
                <th>Timeslot</th>
                <th>Consultant</th>
                <th>Services</th>
              </tr>
            </thead>
            <tbody>
              {this.props.slots.map(slot => (
                <tr key={slot.SlotID}>
                  <td>{this.convertUTCToLocalTime(slot.Timeslot).toLocaleString("da-DK")}</td>
                  <td>{slot.UserID}</td>
                  <td>{slot.ServiceNames}</td>
                  <td><button className="button-7" type="button" onClick={ () => {this.onBook(slot.SlotID) } } disabled={this.state.disabled} >Book</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        );
  }
}

export { SlotTable };