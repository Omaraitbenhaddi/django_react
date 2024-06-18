// src/App.js
import React from 'react';
import './App.css';
import RunPlaybook from './components/RunPlaybook';
import { CssBaseline, Container, ThemeProvider } from '@mui/material';
import getCheckoutTheme from "./components/theme"


function App() {
    const theme = getCheckoutTheme('light');
    return (
        <div className="App">
                <ThemeProvider theme={theme}>
            <header className="App-header">
                <CssBaseline />
                <Container>
                    <header className="App-header">
                        <RunPlaybook />
                    </header>
                </Container>
                </header>
                </ThemeProvider>

        </div>
    );
}

export default App;
