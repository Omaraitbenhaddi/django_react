import React, { useState, useEffect } from 'react';
import { Drawer, Typography, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { fetchLogs } from './useApi';
import PlaybookLogList from './PlaybookLogList';

const DomainDrawer = () => {
  const [open, setOpen] = useState(false);
  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(true);

  useEffect(() => {
    setLoadingLogs(true);
    fetchLogs(1).then(data => {
      setLogs(data.results);
      setLoadingLogs(false);
    }).catch(error => {
      console.error('Error fetching logs:', error);
      setLoadingLogs(false);
    });
  }, []);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <>
      <IconButton onClick={toggleDrawer} sx={{ fontSize: '32px', mb: 2 }}>
        {open ? <ChevronLeft sx={{ fontSize: '32px' }} /> : <ChevronRight sx={{ fontSize: '32px' }} />}
      </IconButton>
      <Drawer anchor="left" open={open} onClose={toggleDrawer}>
        <Typography variant="h6" gutterBottom>
          Service demandé
        </Typography>
        <PlaybookLogList logs={logs} loadingLogs={loadingLogs} />
      </Drawer>
    </>
  );
};

export default DomainDrawer;
