import React, { useState } from 'react';
import { Drawer, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Typography, IconButton, Box } from '@mui/material';
import { ChevronLeft, ChevronRight, AddCircleOutline } from '@mui/icons-material';
import { AddSecrets } from './useApi';

const DomainDrawer = () => {
  const [open, setOpen] = useState(false);
  const [secretModalOpen, setSecretModalOpen] = useState(false);
  const [newSecret, setNewSecret] = useState('');
  const [secretname, setSecretName] = useState('');

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleAddSecretClick = () => {
    setSecretModalOpen(true);
  };

  const handleSecretModalClose = () => {
    setSecretModalOpen(false);
    setNewSecret('');
    setSecretName('');
  };

  const handleSaveSecret = async () => {
    await AddSecrets(secretname, newSecret);
    handleSecretModalClose();
  };

  return (
    <>
      <IconButton onClick={toggleDrawer} sx={{ fontSize: '32px', mb: 2 }}>
        {open ? <ChevronLeft sx={{ fontSize: '32px' }} /> : <ChevronRight sx={{ fontSize: '32px' }} />}
      </IconButton>
      <Drawer anchor="left" open={open} onClose={toggleDrawer} sx={{ width: 300, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <IconButton onClick={toggleDrawer}>
            <ChevronLeft />
          </IconButton>
        </Box>
        <Typography variant="h6" sx={{ mb: 2, textAlign: 'center', color: '#e60000', fontWeight: 'bold' }}>
          Manage Secrets
        </Typography>
        <Button
          onClick={handleAddSecretClick}
          variant="contained"
          color="primary"
          fullWidth
          startIcon={<AddCircleOutline />}
          sx={{ fontSize: '18px', py: '12px', mb: '16px', backgroundColor: '#e60000', '&:hover': { backgroundColor: '#cc0000' } }}
        >
          Add Secret
        </Button>
      </Drawer>

      <Dialog open={secretModalOpen} onClose={handleSecretModalClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', color: '#e60000', fontWeight: 'bold' }}>Add a New Secret</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            value={secretname}
            onChange={(e) => setSecretName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Secret"
            type="text"
            fullWidth
            value={newSecret}
            onChange={(e) => setNewSecret(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button onClick={handleSecretModalClose} variant="outlined" color="primary" sx={{ mr: 1 }}>
            Cancel
          </Button>
          <Button onClick={handleSaveSecret} variant="contained" color="primary" sx={{ backgroundColor: '#e60000', '&:hover': { backgroundColor: '#cc0000' } }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DomainDrawer;
