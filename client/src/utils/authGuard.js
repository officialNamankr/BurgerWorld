import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AuthGuard = ({ children }) => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    console.log("checking authentication", isAuthenticated);
    

    return isAuthenticated ? <Navigate to="/home" /> : children;
};

export default AuthGuard;