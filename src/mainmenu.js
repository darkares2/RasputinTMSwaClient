import React from 'react';
import { ScheduleAppointment } from './shceduleappointment';

const scheduleMenu = 'scheduleMenu';
const listAppointments = 'listAppointments';

class MainMenu extends React.Component {

    constructor(props) {
        super(props);
        const search = window.location.search;
        const userID = new URLSearchParams(search).get("userID");
        this.state = { user: null, userID: userID, error: 'loading...', currentSubmenu: '', serviceList: [], appointmentList: [] };
    }

    componentDidMount() {
        this.loadUser();
    }

    loadUser = () => {
        const current = this;

        (async function () {
            var text = null;
            //const url = 'http://localhost:7071';
            const url = 'https://rasputintmfauserservice.azurewebsites.net';
            await fetch(url + '/api/GetUser?userID=' + current.state.userID)
                .then(response => {
                    console.log("Response: ", response);
                    if (response.status >= 400 && response.status < 600) {
                        current.setState({ error: response.statusText });
                    }
                    return response.json();
                })
                .then(json => { text = json; })
                .catch(error => { console.log("Error: ", error); });
            if (text !== null) {
                current.setState({ error: '' });
                console.log(text);
                current.setState({ user: text });
            }
        })();
    }

    onScheduleAppointment = () => {
        this.setState({currentSubmenu: scheduleMenu, serviceList: [{name: 'Hals'}, {name: 'Generelt'}]})
    }

    onListAppointments = () => {
        this.setState({currentSubmenu: listAppointments, appointmentList: [{name: 'Hals'}, {name: 'Generelt'}]})
    }

    onClickScheduleService = (event, serviceName) => {
        alert("Service chosen: " + serviceName);
    }

    render() {
        if (this.state.user === null) {
            return <div>{this.state.error}</div>;
        }
        var scheduleSubMenu = <span/>;
        if (this.state.currentSubmenu === scheduleMenu) {
            scheduleSubMenu = <ScheduleAppointment userID={this.state.userID} />;
        }
        var appointmentListSubMenu = <span/>;
        if (this.state.currentSubmenu === listAppointments) {
            const items = this.state.appointmentList.map(appointment => (
                <button className="button-7" onClick={e=>{ this.onClickScheduleService(e, appointment.name); }} key={appointment.name}>
                  {appointment.name}
                </button>
              ));
              appointmentListSubMenu = <div >{items}</div>;
        }

        return (
            <div className="fancy">
                <h1>Welcome {this.state.user.Name}</h1>
                <button className="button-7" type="button" onClick={this.onScheduleAppointment} >Schedule new appointment</button>
                {scheduleSubMenu}
                <br/>
                <button className="button-7" type="button" onClick={this.onListAppointments} >List appointments</button>
                {appointmentListSubMenu}
            </div>
        );
    }
}

export { MainMenu };