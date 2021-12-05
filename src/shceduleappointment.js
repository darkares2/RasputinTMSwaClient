import React from 'react';
import { SlotTable } from './slottable';

class ScheduleAppointment extends React.Component {

    constructor(props) {
        super(props);
        this.state = { error: 'loading...', serviceChoice: '', services: [], slots: [], users: [] };
    }

    componentDidMount() {
        this.loadServices();
        this.loadUsers();
        this.loadSlots();
    }

    loadServices = () => {
        const current = this;

        (async function () {
            var text = null;
            const url = 'https://rasputintmfaserviceservice.azurewebsites.net';
            await fetch(url + '/api/GetService')
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
                current.setState({ services: text });
            }
        })();
    }

    loadUsers = () => {
        const current = this;

        (async function () {
            var text = null;
            const url = 'https://rasputintmfauserservice.azurewebsites.net';
            await fetch(url + '/api/GetUser')
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
                current.setState({ users: text });
            }
        })();
    }

    loadSlots = () => {
        const current = this;

        (async function () {
            var text = null;
            const url = 'https://rasputintmfaslotservice.azurewebsites.net';
            await fetch(url + '/api/GetSlot')
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
                current.setState({ slots: text });                
            }
        })();
    }
    onBook = (slotID) => {
        console.log("onBook: ", slotID);
        this.setState({ slots: this.state.slots.filter(x => x.SlotID !== slotID) });                
        console.log("Slots: ", this.state.slots);
    }

    onService = (serviceID) => {
        this.setState({serviceChoice: serviceID})
    }

    render() {        
        const serviceChoices = this.state.services.map((service) => { return <button className="button-7" key={service.ServiceID} type="button" onClick={ () => {this.onService(service.ServiceID) } } >{service.Name}</button>; });
        var data = this.state.slots.map((slot)=> {
            const serviceIDs = slot.ServiceIDs.split(',');
            if (serviceIDs.length > 0) {
                const services = serviceIDs.map((id)=> { return this.state.services.find((service)=> { return service.ServiceID === id })});
                slot.ServiceNames = services.map((service)=> { if (service === undefined) return ''; else return service.Name; }).join(',');
                slot.display = serviceIDs.find((id)=> { return this.state.serviceChoice === id}) !== undefined;
            }
            const user = this.state.users.find((user)=> { return user.UserID === slot.UserID });
            if (user !== undefined)
                slot.UserName = user.Name;
            return slot;
        });
        data = data.filter((d) => { return d.display; });

        return (
            <div className="fancy">
                {serviceChoices}
                <SlotTable slots={data} serviceChoice={this.state.serviceChoice} userID={this.props.userID} onBook={this.onBook} />
                {this.state.error}
            </div>
        );
    }
}

export { ScheduleAppointment };