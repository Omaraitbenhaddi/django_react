// src/App.js
import React from 'react';
import './App.css';
import RunPlaybook from './components/RunPlaybook';
import { CssBaseline, Container } from '@mui/material';
function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>Run Ansible Playbook</h1>
                <CssBaseline />
                <Container>
                    <header className="App-header">
                        <RunPlaybook />
                    </header>
                </Container>
                </header>
        </div>
    );
}

export default App;
