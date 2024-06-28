
// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from './authService';
import { Container, Box, TextField, Button, Typography, Alert, Paper } from '@mui/material';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        authService.login(username, password).then(
            () => {
                navigate('/helloworld');
            },
            (error) => {
                const resMessage =
                    (error.response && error.response.data && error.response.data.detail) || // JWT error message
                    (error.response && error.response.data && error.response.data.message) || // Other error messages
                    error.message ||
                    error.toString();

                setMessage(resMessage);
            }
        );
    };

    return (
        <Container maxWidth="xs">
            <Paper elevation={3} sx={{ padding: 3, marginTop: 8 }}>
                <Box component="form" onSubmit={handleLogin}>
                    <Typography variant="h5" align="center" gutterBottom>
                        Login
                    </Typography>

                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ marginTop: 2 }}
                    >
                        Login
                    </Button>

                    {message && (
                        <Alert severity="error" sx={{ marginTop: 2 }}>
                            {message}
                        </Alert>
                    )}
                </Box>
            </Paper>
        </Container>
    );
};

export default Login;
