import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { List, ListItem, ListItemText, Typography, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { fetchLog } from './useApi';

const PlaybookLogList = ({ logs, loadingLogs }) => {
  const navigate = useNavigate();

  const handleLogClick = async (id) => {

    const logSelected = await fetchLog(id);
    if (logSelected) {
      navigate('/logs', { state: { logs: logSelected.output } });
    }
  };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Playbook Logs
      </Typography>
      {loadingLogs ? (
        <CircularProgress />
      ) : (
        <List disablePadding>
          {logs.map((log) => (
            <ListItem 
              key={log.id} 
              sx={{ py: 1, px: 0 }} 
              onClick={() => handleLogClick(log.id)}
            >
              <ListItemText primary={log.playbook_name.slice(0, -4)} secondary={log.created_at.slice(0, 10)} />
            </ListItem>
          ))}
        </List>
      )}
    </React.Fragment>
  );
};

PlaybookLogList.propTypes = {
  logs: PropTypes.array.isRequired,
  loadingLogs: PropTypes.bool.isRequired,
};

export default PlaybookLogList;
