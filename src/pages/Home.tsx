import { Box, Grid, Card, CardContent, Typography, Button } from '@mui/material';
import { Mood, Timer, Chat, Psychology } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Track Your Mood',
      description: 'Log and monitor your emotional well-being',
      icon: <Mood sx={{ fontSize: 40 }} />,
      path: '/mood'
    },
    {
      title: 'Daily Routine',
      description: 'Record your activities and their impact',
      icon: <Timer sx={{ fontSize: 40 }} />,
      path: '/routine'
    },
    {
      title: 'AI Chat Support',
      description: 'Get guidance from our mindful AI companion',
      icon: <Chat sx={{ fontSize: 40 }} />,
      path: '/chat'
    },
    {
      title: 'Connect with Consultants',
      description: 'Schedule sessions with professionals',
      icon: <Psychology sx={{ fontSize: 40 }} />,
      path: '/consultants'
    }
  ];

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
        Welcome to SelfMindness
      </Typography>
      
      <Grid container spacing={3}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                cursor: 'pointer',
                transition: '0.3s',
                '&:hover': { transform: 'translateY(-5px)' }
              }}
              onClick={() => navigate(feature.path)}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ mb: 2, color: 'primary.main' }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
