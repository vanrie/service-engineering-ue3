import { useEffect } from 'react';
import React, { useState } from "react";
import './Dashboard.css';
import { getEvents } from '../services/EventsService';
import { deleteEvent } from '../services/EventsService';
import { createEvent } from '../services/EventsService';
import { changeEventParticipation } from '../services/EventsService';
import { getUserInfo } from '../services/UserService';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useSearchParams } from 'react-router-dom';



function Dashboard() {
    const [events, setEvents] = useState();
    const [userInfo, setUserInfo] = useState({
        id: null,
        firstName: '',
        lastName: '',
        email: '',
        isAdmin: false
    });
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [type, setType] = useState("");


    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    let user = {
        _id: '1',
        firstName: 'Asda',
        lastName: 'Asda',
        email: 'Asdd',
        isAdmin: true,
    }

    const [searchParams] = useSearchParams();

    useEffect(() => {
        getUserInfo(searchParams.get('userId')).then(res => {
            user = res.data;    

            setUserInfo(user);
                getAllEvents()


        })



    }, [])

    function getAllEvents() {
        getEvents().then(events => {

            const allEvents = []
            for (const event of events.data) {
                console.log(user);
                for (const user of event.participants || []) {
                    if (user.id == user) {
                        event.isParticipant = true;
                    } else {
                        event.isParticipant = false;
                    }
                }
                allEvents.push(event);


            }
            setEvents(allEvents);
        })
    }

    function removeParticipation(event) {
        const index = event.participants.indexOf(user.id);
        if (index !== -1) {
            event.participants.splice(index, 1);
        }
        changeEventParticipation(event.participants).then(() => {
            getAllEvents();
        })
    }

    function createNewEvent() {
        console.log(name, type, description, date);
        let body = {
            name: name,
            type: type,
            description: description,
            date: date,
            id: createId(),
            participants: []
        }

        createEvent(body).then(() => {
            getAllEvents();

        });
    }

    function createId(){
        let result = '';
        const characters = 'abcdef0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < 32) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
          counter += 1;
        }
        return result;
    }


    function createParticipation(event) {
        event.participants.push(searchParams.get('userId'));
        console.log(event.participants);
        changeEventParticipation(event.id, event.participants).then(() => {
            getAllEvents();
        })
    }

    function deleteEventById(eventId) {
        deleteEvent(eventId).then(() => {
            getAllEvents();
        });
    }
    return (
        <div className="dashboard">
            <div className="header-wrapper ">
                <h1>Event Service</h1>
                <h3>Immer bestens informiert!</h3>
                <p> At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. </p>
                {user.isAdmin ? <Button variant="primary" onClick={() => { handleShow() }}>Event erstellen</Button> : null}
            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Neues Event erstellen</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" name="name" placeholder="Name" value={name}
                                onChange={e => setName(e.target.value )} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Beschreibung</Form.Label>
                            <Form.Control as="textarea" name="description" rows={3} placeholder="Beschreibung einfügen"
                                value={description}
                                onChange={e => setDescription(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Datum</Form.Label>
                            <Form.Control type="date" name="date" placeholder="Datum"
                                value={date}
                                onChange={e => setDate(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Art der Veranstaltung</Form.Label>
                            <Form.Select value={type}
                                onChange={e => setType(e.target.value )}>
                                <option>Konzert</option>
                                <option>Sport</option>
                                <option>Messe</option>
                                <option>Sonstiges</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={createNewEvent} type="submit">
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

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
                                {user.isAdmin ? <Button variant="danger" onClick={() => { deleteEventById(event.id) }}>Event löschen</Button> : null}
                            </div>


                        </Card.Body>
                    </Card>


                ))}
            </div>
        </div>
    );
}

export default Dashboard;
