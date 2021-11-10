import React from 'react';


class AppointmentTable extends React.Component {

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

  render() {
      return (
          <table className="styled-table">
            <caption>Available appointments</caption>
            <thead>
              <tr>
                <th>Timeslot</th>
                <th>Consultant</th>
                <th>Service</th>
              </tr>
            </thead>
            <tbody>
              {this.props.appointments.map(appointment => (
                <tr key={appointment.AppointmentID}>
                  <td>{this.convertUTCToLocalTime(appointment.Timeslot).toLocaleString("da-DK")}</td>
                  <td>{appointment.SlotUserName}</td>
                  <td>{appointment.ServiceName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
  }
}

export { AppointmentTable };