import axios from 'axios';

export const getEvents = () => {
    return axios.get('http://localhost:5000/api/getAllEvents');
}

export const createEvent = (body) => {
    return axios.post('http://localhost:5000/api/createEvent', body);
}
export const updateEvent = (eventId, body) => {
    return axios.put('http://localhost:5000/api/updateEvent/' + eventId, body);
}

export const changeEventParticipation = (body) => {
    return axios.put('http://localhost:5000/api/createEvent/' + body._id, body);
}

export const deleteEvent = (eventId) => {
    return axios.delete(`http://localhost:5000/api/deleteEvent/${eventId}`)
}

