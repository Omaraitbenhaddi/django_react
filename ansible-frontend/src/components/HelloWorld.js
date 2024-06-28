import React, { useEffect, useState } from 'react';
import axios from 'axios';
import authService from './authService';

const HelloWorld = () => {
    const [message, setMessage] = useState('');

    useEffect(() => {
        const user = authService.getCurrentUser();
        setMessage('You are not authenticated.');
        if (user && user.token) {
            axios.get('http://localhost:8000/protected/', {
                headers: {
                    'Authorization': 'Token ' + user.token
                }
            }).then(response => {
                console.log(111111)
                console.log('Response:', response);
                setMessage(response.data.message);
            }).catch(() => {
                setMessage('You are not authenticated.');
            });
        }
    }, []);

    return (
        <div>
            <h1>{message}</h1>
        </div>
    );
};

export default HelloWorld;
