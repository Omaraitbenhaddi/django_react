// src/App.js
import React from 'react';
import './App.css';
import RunPlaybook from './components/RunPlaybook';
import LogsPage from './components/LogsPage'; // Assurez-vous d'importer LogsPage
import { CssBaseline, Container, ThemeProvider } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Mettre à jour l'importation
import getCheckoutTheme from "./components/theme"

function App() {
    const theme = getCheckoutTheme('light');
    return (
        <div className="App">
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Router>
                    <Container>
                        <header className="App-header">
                            <Routes>
                                <Route path="/" element={<RunPlaybook />} />
                                <Route path="/logs" element={<LogsPage />} />
                            </Routes>
                        </header>
                    </Container>
                </Router>
            </ThemeProvider>
        </div>
    );
}

export default App;
