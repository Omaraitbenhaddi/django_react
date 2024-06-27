import React, { useState, useEffect } from 'react';
import { Drawer, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Typography, IconButton, Box, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import { ChevronLeft, ChevronRight, AddCircleOutline } from '@mui/icons-material';
import { AddSecrets ,fetchDomains , fetchLogs } from './useApi';
import axios from 'axios';
import PlaybookLogList from './PlaybookLogList';

const DomainDrawer = () => {
  const [open, setOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(true);

 

  useEffect(() => {
    fetchLogs(setLogs , setLoadingLogs);
  }, []);

 

  const toggleDrawer = () => {
    setOpen(!open);
  };



  return (
    <>
      <IconButton onClick={toggleDrawer} sx={{ fontSize: '32px', mb: 2 }}>
        {open ? <ChevronLeft sx={{ fontSize: '32px' }} /> : <ChevronRight sx={{ fontSize: '32px' }} />}
      </IconButton>
      <Drawer anchor="left" open={open} onClose={toggleDrawer} sx={{ width: 300, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Service demende
        </Typography>
        <PlaybookLogList logs={logs} loadingLogs={loadingLogs} />
      </Drawer>

      
    </>
  );
};

export default DomainDrawer;
