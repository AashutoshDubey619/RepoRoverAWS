import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Manages auth state: reads token + user from localStorage,
 * redirects to /login if unauthenticated, and exposes logout.
 */
export default function useAuth() {
    const [username, setUsername] = useState('Engineer');
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const userObj = JSON.parse(storedUser);
                setUsername(userObj.username || 'Engineer');
            } catch {
                setUsername('Engineer');
            }
        }
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return { username, logout };
}
