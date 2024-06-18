import * as React from 'react';
import PropTypes from 'prop-types';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

const DomainList = ({ domains, loadingDomains, onDomainSelect }) => {
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Select Domain
      </Typography>
      {loadingDomains ? (
        <CircularProgress />
      ) : (
        <List disablePadding>
          {domains.map((domain) => (
            <ListItem button key={domain} onClick={() => onDomainSelect(domain)} sx={{ py: 1, px: 0 }}>
              <ListItemText primary={domain}  />
            </ListItem>
          ))}
        </List>
      )}
    </React.Fragment>
  );
};

DomainList.propTypes = {
  domains: PropTypes.array.isRequired,
  loadingDomains: PropTypes.bool.isRequired,
  onDomainSelect: PropTypes.func.isRequired,
};

export default DomainList;
