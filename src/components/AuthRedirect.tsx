import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginPage } from '../pages/auth-pages/LoginPage';

interface AuthRedirectProps {
  children?: React.ReactNode;
}

export const AuthRedirect: React.FC<AuthRedirectProps> = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndRedirect = () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        // Check if token is valid (not expired)
        try {
          const tokenPayload = JSON.parse(atob(token.split('.')[1]));
          const currentTime = Date.now() / 1000;
          
          if (tokenPayload.exp > currentTime) {
            // Token is valid, redirect to workspace list
            navigate('/workspace', { replace: true });
            return;
          } else {
            // Token is expired, remove it
            localStorage.removeItem('token');
          }
        } catch (error) {
          // Invalid token format, remove it
          localStorage.removeItem('token');
        }
      }
    };

    checkAuthAndRedirect();
  }, [navigate]);

  // If children are provided, render them (for flexibility)
  // Otherwise, render the LoginPage
  return children ? <>{children}</> : <LoginPage />;
};
