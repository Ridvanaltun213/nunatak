import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = () => {
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div">
          Nuanetek Country Pricing Manager
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Typography variant="subtitle2" sx={{ mr: 2 }}>
         LemoonCreative Ideasoft Integration
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 
