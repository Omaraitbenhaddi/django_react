import React from 'react';
import { FormikProvider } from 'formik';
import { Box, Typography, Grid, Card, CardContent, CardActions, Button } from '@mui/material';

const cardSize = 250;

const PlaybookCard = ({ playbook, onClick }) => (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Card
            sx={{
                width: cardSize,
                height: cardSize,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRadius: 3,
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
                },
                backgroundColor: '#ffffff'
            }}
        >
            <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
                <Typography variant="h5" component="div" align="center" sx={{ color: '#e60000', fontWeight: 'bold' }}>
                    {playbook}
                </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button size="small" variant="contained" sx={{ backgroundColor: '#e60000', color: '#ffffff', fontWeight: 'bold', '&:hover': { backgroundColor: '#cc0000' } }} onClick={onClick}>
                    Run
                </Button>
            </CardActions>
        </Card>
    </div>
);

export default PlaybookCard;
