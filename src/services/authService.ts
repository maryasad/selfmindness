import axios from 'axios';

export interface LoginCredentials {
  identifier: string;  // Can be either email or phone
  password: string;
  type: 'email' | 'phone';  // Added to specify the type of identifier
}

export interface RegisterCredentials {
  name: string;
  email?: string;
  phone?: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
  };
}

const API_BASE_URL = 'http://localhost:3001/api/auth';

// Validation functions
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  // Accepts formats like: +1234567890, 1234567890, +12-345-678-90
  const phoneRegex = /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
  return phoneRegex.test(phone);
};

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    console.log('Attempting login with:', { ...credentials, password: '***' });
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, credentials);
      console.log('Login response:', response.data);
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message);
      if (error.response) {
        throw new Error(error.response.data.message || 'Login failed');
      }
      throw new Error('Network error occurred');
    }
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    console.log('Attempting registration with:', { ...credentials, password: '***' });
    
    if (!credentials.email && !credentials.phone) {
      throw new Error('Either email or phone number is required');
    }

    // Validate email/phone before sending request
    if (credentials.email && !isValidEmail(credentials.email)) {
      throw new Error('Invalid email format');
    }
    if (credentials.phone && !isValidPhone(credentials.phone)) {
      throw new Error('Invalid phone format');
    }
    
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, credentials);
      console.log('Registration response:', response.data);
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error: any) {
      console.error('Registration error:', error.response?.data || error.message);
      if (error.response) {
        throw new Error(error.response.data.message || 'Registration failed');
      }
      throw new Error('Network error occurred. Is the server running?');
    }
  }

  logout(): void {
    localStorage.removeItem('user');
  }

  getCurrentUser(): AuthResponse | null {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        return JSON.parse(userStr);
      }
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      localStorage.removeItem('user'); // Clear invalid data
    }
    return null;
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
}

export default new AuthService();
