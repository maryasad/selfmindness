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
  Alert
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import authService, { isValidEmail, isValidPhone } from '../services/authService';

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [contactType, setContactType] = useState<'email' | 'phone'>('email');
  const [contactValue, setContactValue] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [contactError, setContactError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { register } = useAuth();
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
    
    // Validate name
    if (!name.trim()) {
      setErrorMessage('Name is required');
      return;
    }

    // Validate contact
    if (!validateContact(contactType, contactValue)) {
      return;
    }

    // Validate password
    if (!password) {
      setPasswordError('Password is required');
      return;
    }

    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const credentials = {
        name,
        password,
        ...(contactType === 'email' ? { email: contactValue } : { phone: contactValue })
      };

      await register(credentials);
      navigate('/');
    } catch (err: any) {
      console.error('Registration error:', err);
      setErrorMessage(err.message || 'Registration failed. Please try again.');
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
          Sign Up
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Full Name"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!name && errorMessage === 'Name is required'}
            helperText={!name && errorMessage === 'Name is required' ? 'Name is required' : ''}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel id="contact-type-label">Contact Type</InputLabel>
            <Select
              labelId="contact-type-label"
              id="contact-type"
              value={contactType}
              label="Contact Type"
              onChange={(e) => {
                setContactType(e.target.value as 'email' | 'phone');
                setContactValue('');
                setContactError('');
              }}
            >
              <MenuItem value="email">Email</MenuItem>
              <MenuItem value="phone">Phone Number</MenuItem>
            </Select>
          </FormControl>

          <FormControl error={!!contactError} fullWidth>
            <TextField
              margin="normal"
              required
              fullWidth
              id="contact"
              label={contactType === 'email' ? 'Email Address' : 'Phone Number'}
              name="contact"
              autoComplete={contactType === 'email' ? 'email' : 'tel'}
              value={contactValue}
              onChange={handleContactChange}
              error={!!contactError}
              placeholder={contactType === 'email' ? 'example@email.com' : '+1234567890'}
              helperText={contactError}
            />
          </FormControl>

          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError('');
            }}
            error={!!passwordError}
            helperText={passwordError}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setPasswordError('');
            }}
            error={!!passwordError}
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
            {isLoading ? <CircularProgress size={24} /> : 'Sign Up'}
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Link href="/login" variant="body2">
              {"Already have an account? Sign In"}
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};
