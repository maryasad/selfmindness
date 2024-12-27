import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Link,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Alert,
  Snackbar
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import authService, { isValidEmail, isValidPhone } from '../services/authService';

export const Login: React.FC = () => {
  const [contactType, setContactType] = useState<'email' | 'phone'>('email');
  const [contactValue, setContactValue] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [contactError, setContactError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { login, error } = useAuth();
  const navigate = useNavigate();

  const validateContact = (type: 'email' | 'phone', value: string) => {
    if (!value) {
      setContactError(`${type === 'email' ? 'Email' : 'Phone number'} is required`);
      return false;
    }

    if (type === 'email' && !isValidEmail(value)) {
      setContactError('Please enter a valid email address');
      return false;
    }

    if (type === 'phone' && !isValidPhone(value)) {
      setContactError('Please enter a valid phone number');
      return false;
    }

    setContactError('');
    return true;
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setContactValue(value);
    if (value) {
      validateContact(contactType, value);
    } else {
      setContactError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!validateContact(contactType, contactValue)) {
      return;
    }

    if (!password) {
      setErrorMessage('Password is required');
      return;
    }

    setIsLoading(true);
    try {
      await login({
        identifier: contactValue,
        password,
        type: contactType
      });
      navigate('/');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={3}
        sx={{
          marginTop: 8,
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Sign In
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Contact Method</InputLabel>
            <Select
              value={contactType}
              label="Contact Method"
              onChange={(e) => {
                setContactType(e.target.value as 'email' | 'phone');
                setContactValue('');
                setContactError('');
              }}
            >
              <MenuItem value="email">Email</MenuItem>
              <MenuItem value="phone">Phone</MenuItem>
            </Select>
          </FormControl>

          <TextField
            margin="normal"
            required
            fullWidth
            id="contact"
            label={contactType === 'email' ? 'Email Address' : 'Phone Number'}
            name="contact"
            autoComplete={contactType === 'email' ? 'email' : 'tel'}
            autoFocus
            value={contactValue}
            onChange={handleContactChange}
            error={!!contactError}
            helperText={contactError}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {errorMessage && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errorMessage}
            </Alert>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Sign In'}
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Link href="/register" variant="body2">
              {"Don't have an account? Sign Up"}
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};
