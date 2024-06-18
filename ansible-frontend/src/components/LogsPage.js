// src/components/LogsPage.jsx
import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const LogsPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;

    return (
        <Container maxWidth="lg">
            <Box mt={5}>
                <Button variant="contained" color="primary" onClick={() => navigate(-1)}>
                    Retour
                </Button>
                <Typography variant="h4" align="center" gutterBottom>
                    Playbook Execution Logs
                </Typography>
                {state?.logs ? (
                    <Box mt={2} sx={{ backgroundColor: '#333', color: '#fff', padding: '16px', borderRadius: '8px', overflowX: 'auto' }}>
                        <pre>{state.logs}</pre>
                    </Box>
                ) : (
                    <Typography variant="body1" color="textSecondary">
                        No logs available.
                    </Typography>
                )}
            </Box>
        </Container>
    );
};

export default LogsPage;
