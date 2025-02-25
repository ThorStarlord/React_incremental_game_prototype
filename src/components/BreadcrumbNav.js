import React from 'react';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { towns } from '../modules/data';

const BreadcrumbNav = () => {
  // Always call hooks at the top level of your component
  const location = useLocation();
  const navigate = useNavigate();
  
  const pathnames = location.pathname.split('/').filter((x) => x);

  const breadcrumbNameMap = {
    'game': 'Game World',
    'settings': 'Settings',
    'town': 'Town',
    'npc': 'NPC'
  };

  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
      <Link component={RouterLink} to="/" color="inherit">
        Main Menu
      </Link>
      
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;

        // Find display name (handle town and NPC ids)
        let displayName = breadcrumbNameMap[value] || value;
        
        // Check if it's a town ID
        const town = towns.find(t => t.id === value);
        if (town) {
          displayName = town.name;
        }

        return last ? (
          <Typography color="text.primary" key={to}>
            {displayName}
          </Typography>
        ) : (
          <Link
            component={RouterLink}
            to={to}
            key={to}
            color="inherit"
          >
            {displayName}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

export default BreadcrumbNav;