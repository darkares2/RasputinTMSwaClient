import React from 'react';


class SlotTable extends React.Component {

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
                    <td>{slot.Timeslot}</td>
                    <td>{slot.UserID}</td>
                    <td>{slot.ServiceNames}</td>
                    <td><button className="button-7" type="button" onClick={ () => {this.onBook(slot.SlotID) } } >Book</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          );
    }
}

export { SlotTable };