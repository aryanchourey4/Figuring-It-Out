import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks';
import { showToast } from '../utils/functions';

const Navbar = () => {
    const user = useAppSelector((state) => state.user.user);
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState(false);
    useEffect(() => {
        user.id ? setLoggedIn(true) : setLoggedIn(false);
      }, [user.id]);
    
      const signOut = () => {
        window.location.reload();
        navigate('/');
        showToast('success', 'Goodbye!👋');
      };
    return(
        <nav className="flex justify-between items-center h-16 bg-white text-black relative shadow-sm font-mono" role="navigation">
            Navbar
            <Link to="/" className="pl-8">Home</Link>
            <button onClick={signOut}>Log Out</button>
        </nav>
    );

};

export default Navbar;