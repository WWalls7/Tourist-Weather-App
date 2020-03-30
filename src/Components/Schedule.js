import React, { Component } from 'react'
import Label from './Label'
import '../Styles/Schedule.css';
import Header from './Header';
import { Container, Button } from 'react-floating-action-button'
import Card from './Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudShowersHeavy, faCloudSun, faCloud } from '@fortawesome/free-solid-svg-icons';


export class Schedule extends Component {
    // initializes the state for the component with the props passed in from the form 
    state = {
        obj : this.props.location.state.selectedInformation,
        sel : this.props.location.state.selectedInformation.selections,
        sdd : this.props.location.sdd
    }

    // contains css for the background of the date cards
    background = () =>{
        return{
            background: `linear-gradient(45deg, ${this.state.obj.c1} 0%, ${this.state.obj.c2} 100%, ${this.state.obj.c2} 100%)`,
        }
    }

    // deletes the current schedule and redirects to the home page
    deleteItem = () => {
        for(var i = 0; i < this.state.sdd.length; i++){
            if(this.state.sdd[i] === this.state.obj){
                this.setState(
                    this.state.sdd.splice(i, 1)
                )
            }
        }

        this.props.history.push({
            pathname: '/home',
            state: {
                data : this.state.sdd
            }
        })
    }

    formatDate = (date) => {
        return date.charAt(8)+date.charAt(9)+"/"+date.charAt(5)+date.charAt(6)+"/"+date.charAt(0)+date.charAt(1)+date.charAt(2)+date.charAt(3)
    }

    // gets the weather, date, and description information for the available days
    // and returns an array of daily information
    dates = () => {
        var datetime1 = this.state.obj.information.dayone.dt_txt.split(" ")
        var date1 = {date: datetime1[0], weather : this.state.obj.information.dayone.main.temp, desc : this.state.obj.information.dayone.weather[0].main}
        var datetime2 = this.state.obj.information.daytwo.dt_txt.split(" ")
        var date2 = {date: datetime2[0], weather : this.state.obj.information.daytwo.main.temp, desc : this.state.obj.information.daytwo.weather[0].main}
        var datetime3 = this.state.obj.information.daythree.dt_txt.split(" ")
        var date3 = {date: datetime3[0], weather : this.state.obj.information.daythree.main.temp, desc : this.state.obj.information.daythree.weather[0].main} 
        var datetime4 = this.state.obj.information.dayfour.dt_txt.split(" ")
        var date4 = {date: datetime4[0], weather : this.state.obj.information.dayfour.main.temp, desc : this.state.obj.information.dayfour.weather[0].main}
        var datetime5 = this.state.obj.information.dayfive.dt_txt.split(" ")
        var date5 = {date: datetime5[0], weather : this.state.obj.information.dayfive.main.temp, desc : this.state.obj.information.dayfive.weather[0].main}
        return [date1, date2, date3, date4, date5]
    }

    // function returns an array containing the selected dates
    scheduledDates = () => {
        var dates = this.dates()
        var selected = []
        var count = 0
        var startposition
        var endposition
        for (var j = 0; j < dates.length; j++) {
            if(this.state.obj.startdate === dates[j].date){
                startposition = j
            }
            if (this.state.obj.enddate === dates[j].date){
                endposition = j
            }
        }

        for (j = startposition; j <= endposition; j++) {
                selected[count] = dates[j]
                count ++
        }
        return selected
    }

    // function for checking the the activites that can be completed during a single day
    check = (date) => {
        var available = []
        var events = this.state.obj.information.events
        var selections = this.state.sel
        // for each of the events in the available event list
        for (var i = 0; i <events.length; i++){
            // for each of the selections
            for (var j = 0; j <selections.length; j++){
                // find the selected activity in the list of available events
                if(selections[j] === events[i].activity){
                    // if the weather is over 15 C, the event is outdoor, and it is not raining, then the activity
                    // can take place on that day
                    if(date.weather > 5 && events[i].location === "outdoor" && date.desc !== "Rain"){
                        available.push(selections[j])
                    }
                    else{
                        // if the event is indoor in can be completed any day
                        if(events[i].location === "indoor"){
                            available.push(selections[j])
                        }
                    }
                } 
            }
        }
        
        // if no activity can be scheduled on that day print a message
        if (available.length === 0){
            available = ["Unsuitable weather on this day"]
        }
        return available
    }

    icon = (desc) => {
        if(desc === "Clear" || desc === "Sunny"){
            return faCloudSun
        }
        else if(desc === "Clouds"){
            return faCloud
        }
        else if(desc === "Rain"){
            return faCloudShowersHeavy
        }
    }

    render() {
        var dest = this.state.sdd[0].information
        console.log(dest)
        return (
            <div >
                <Header history = {this.props.history} sdd={this.state.sdd} />
                <div className="welcome"><Label text="Selected Destination"/></div>
                {/* display current weather information for the selected location */}
                <Card back={dest.url} title={dest.name} weather={dest.temp} desc={dest.desc} width="100" height="110"/>
                <div className="welcome"><Label text="Schedule for Events"/></div>
                <div className="events">
                    <div className="verticalScroll schedule">
                        {/* for each of the selected events, print the available dates that the activity
                        may be completed during, or an appropriate message if the activity can be completed
                        on all or none of the days */}
                        {console.log(this.scheduledDates())}
                        {this.scheduledDates().map((date, index) => {
                            return(
                                <div style={this.background()} className ="value" key={index}>
                                    <div className="float">
                                        <h4 id="headingcity2" className="date"><b>{this.formatDate(date.date)}</b></h4>
                                        <FontAwesomeIcon className="schedsize" icon={this.icon(date.desc)}/>
                                        <h4 className="desc">{date.desc}</h4>
                                        <h4 id="headingcity2" className="weather"><b>{Math.round(date.weather)}°C</b></h4>
                                    </div>
                                    <div className="float right">
                                        {this.check(date).map((activity, index) => {
                                            return (
                                                <label className="label days" key={index}>{activity}</label>
                                            )
                                        })}   
                                    </div>  
                                </div>
                            )
                        })}
                    </div>
                </div>
                <Container className="fabPlacement">
                    <Button
                        icon="fas fa-times"
                        styles={{backgroundColor: this.state.obj.c1 , color : "#fff"}}
                        rotate={false}
                        onClick={this.deleteItem} 
                        tooltip= "Delete Schedule" 
                        onmouseover={this.tooltip}/>
                </Container>
            </div>
        )
    }
}

export default Schedule
