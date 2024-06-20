import React from 'react';
import { Card, CardContent, CardActions, Typography, Button } from '@mui/material';

const cardSize = 250

const PlaybookCard = ({ playbook, onClick }) => (
    <div style={{ display: 'flex', justifyContent: 'center' }}>

    <Card 
        sx={{ 
            width: cardSize, 
            height: cardSize, 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between', 
            borderRadius: 2, 
            boxShadow: 3, 
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: 6,
            }
        }}
    >
        <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
            <Typography variant="h5" component="div" align="center" color="secondary">
                {playbook}
            </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: 'center', pb: 1 }}>
            <Button size="small" variant="contained" color="primary" onClick={onClick}>Run</Button>
        </CardActions>
    </Card>
</div>
);

export default PlaybookCard;