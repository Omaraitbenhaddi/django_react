import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { List, ListItem, ListItemText, CircularProgress, Pagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { fetchLogs, fetchLog } from './useApi';

const PlaybookLogList = ({ loadingLogs }) => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(loadingLogs);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const getLogs = async (page) => {
      setLoading(true);
      try {
        const data = await fetchLogs(page);
        setLogs(data.results);
        setCount(data.count);
      } catch (error) {
        console.error('Error fetching logs:', error);
      } finally {
        setLoading(false);
      }
    };

    getLogs(page);
  }, [page]);

  const handleLogClick = async (id) => {
    try {
      const data = await fetchLog(id);
      navigate('/logs', { state: { logs: data.output } });
    } catch (error) {
      console.error('Error fetching log details:', error);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <>
      {loading ? (
        <CircularProgress />
      ) : (
        <List disablePadding>
          {logs.map((log) => (
            <ListItem 
              button
              key={log.id} 
              sx={{ py: 1, px: 5 }} 
              onClick={() => handleLogClick(log.id)}
            >
              <ListItemText 
                primary={`${log.playbook_name.slice(0, -4)} by ( ${log.user.username} )` } 
                secondary={`${log.created_at.slice(0, 10)} ${log.created_at.slice(11, 19)}`} 
              /> 
            </ListItem>
          ))}
        </List>
      )}
      <Pagination
        count={Math.ceil(count / 10)}
        page={page}
        onChange={handlePageChange}
        color="primary"
      />
    </>
  );
};

PlaybookLogList.propTypes = {
  loadingLogs: PropTypes.bool.isRequired,
};

export default PlaybookLogList;
