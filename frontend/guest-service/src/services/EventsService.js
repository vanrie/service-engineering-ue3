import axios from 'axios';

export const getEvents = () => {
    return axios.get('http://localhost:5000');
}

export const createEvents = () => {
    return axios.post('http://localhost:5000/createEvent');
}