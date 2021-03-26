import axios from 'axios';
const { REACT_APP_API } :any= process.env;

const Api = axios.create({
    baseURL: `http://localhost:8080/`
});


export default Api;