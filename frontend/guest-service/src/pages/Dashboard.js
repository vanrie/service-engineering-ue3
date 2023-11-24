import { useEffect } from 'react';
import React, { useState } from "react";
import './Dashboard.css';
import { getEvents } from '../services/EventsService';
import { deleteEvent } from '../services/EventsService';
import { changeEventParticipation } from '../services/EventsService';
import { getUserInfo } from '../services/UserService';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';


function Dashboard() {
    const [events, setEvents] = useState();
    const [userInfo, setUserInfo] = useState();
    const dummyUser = {
        _id: '1',
        firstName: 'Asda',
        lastName: 'Asda',
        email: 'Asdd',
        isAdmin: true,
    }

    useEffect(() => {
        setUserInfo(dummyUser);

        /*
        getUserInfo().then(res => {
            setUserInfo(dummyUser);
        })*/

        getAllEvents()
        

    }, [])

    function getAllEvents(){
        getEvents().then(events => {

            console.log(events);
            const allEvents = []
            for (const event of events.data) {
                for (const user of event.participants) {
                    if (dummyUser._id == user) {
                        console.log('is participant');
                        event.isParticipant = true;
                    } else {
                        console.log('no participant');
                        event.isParticipant = false;
                    }
                    allEvents.push(event);
                }

            }
            setEvents(allEvents);
        })
    }

    function removeParticipation(event) {
        const index = event.participants.indexOf(dummyUser._id);
        if (index !== -1) {
            event.participants.splice(index, 1);
        }
        changeEventParticipation(event).then(() => {
            getAllEvents();
        })
    }


    function createParticipation(event) {
        event.participants.push(dummyUser._id);
        changeEventParticipation(event).then(() => {
            getAllEvents();
        })
    }

    function deleteEventById(eventId) {
        console.log(eventId);

        deleteEvent(eventId);
    }

    return (
        <div className="dashboard">
            <div class="header-wrapper ">
                <h1>Event Service</h1>
                <h3>Immer bestens informiert!</h3>
                <p> At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. </p>
                {dummyUser.isAdmin ? <Button variant="primary" onClick={() => {  }}>Event erstellen</Button> : null }
            </div>

            <div className="list-wrapper">
                {events?.map((event) => (
                    <Card style={{ width: '20rem' }} key={event._id}>
                        <Card.Body>
                            <Card.Title>{event.name}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">{event.type}</Card.Subtitle>
                            <Card.Text>
                                {event.description}
                            </Card.Text>
                            <div className='button-wrapper'>
                                {event.isParticipant ? <Button variant="warning" onClick={() => { removeParticipation(event) }}>Austragen</Button> : <Button variant="success" onClick={() => { createParticipation(event) }}>Teilnehmen</Button>}
                                {dummyUser.isAdmin ? <Button variant="danger" onClick={() => { deleteEventById(event._id) }}>Event löschen</Button> : null}
                            </div>


                        </Card.Body>
                    </Card>


                ))}
            </div>
        </div>
    );
}

export default Dashboard;
