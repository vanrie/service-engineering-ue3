import axios from 'axios';

export const getEvents = () => {
    return axios.get('http://localhost:5000');
}