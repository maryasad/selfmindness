import { Box, Container, AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { Menu as MenuIcon, Person, Timeline, Chat } from '@mui/icons-material';
import { Outlet, useNavigate } from 'react-router-dom';

export const Layout = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            SelfMindness
          </Typography>
          <IconButton color="inherit" onClick={() => navigate('/profile')}>
            <Person />
          </IconButton>
          <IconButton color="inherit" onClick={() => navigate('/insights')}>
            <Timeline />
          </IconButton>
          <IconButton color="inherit" onClick={() => navigate('/chat')}>
            <Chat />
          </IconButton>
        </Toolbar>
      </AppBar>
      
      <Container component="main" sx={{ flexGrow: 1, py: 3 }}>
        <Outlet />
      </Container>
    </Box>
  );
};
