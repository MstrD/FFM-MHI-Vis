// src/boot/axios.js

import Vue from 'vue'
import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: 'http://localhost:4000/settings/',
    timeout: 1000,
    headers: {
        'X-Custom-Header': 'foobar',
        //'Access-Control-Allow-Origin': '*'
    }
});

export default ({ Vue }) => {
    Vue.prototype.$axios = axiosInstance;
}

export { axiosInstance }