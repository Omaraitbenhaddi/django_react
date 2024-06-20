import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Drawer, List, ListItem, ListItemText, IconButton, Divider } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

const DomainDrawer = ({ domains, onSelectDomain }) => {
  const [open, setOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState(null);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleDomainClick = (domain) => {
    onSelectDomain(domain);
    setSelectedDomain(domain);
  };

  return (
    <>
      <IconButton onClick={toggleDrawer}>
        {open ? <ChevronLeft /> : <ChevronRight />}
      </IconButton>
      <Drawer anchor="left" open={open} onClose={toggleDrawer}>
        <div>
          <IconButton onClick={toggleDrawer}>
            <ChevronLeft />
          </IconButton>
        </div>
        <Divider />
        <List>
          {domains.map((domain) => (
            <ListItem
              button
              key={domain}
              onClick={() => handleDomainClick(domain)}
              selected={selectedDomain === domain}
            >
              <ListItemText primary={domain} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

DomainDrawer.propTypes = {
  domains: PropTypes.array.isRequired,
  onSelectDomain: PropTypes.func.isRequired,
};

export default DomainDrawer;
