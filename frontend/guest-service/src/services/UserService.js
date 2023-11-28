import axios from 'axios';

export const getUserInfo = (id) => {
    return axios.get('http://localhost:5000/api/getUserInfo:' + id);
}

export const userInfo = () => {
    return axios.get('http://localhost:5000/api/getUserInfo').then((response) => {return response.data});

}

export const registerUser = (body) => {
    return axios.post('http://localhost:5000/api/registerUser', body);
}

export const login = (body) => {
    return axios.post('http://localhost:5000/api/login', body);
}

export const editUser = (userId, body) => {
    return axios.put('http://localhost:5000/api/editUser/' + userId, body);
}

