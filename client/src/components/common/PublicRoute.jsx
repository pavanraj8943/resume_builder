import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserContext } from '../../context/UserContext';

export const PublicRoute = ({ children }) => {
    const { isAuthenticated, loading } = useUserContext();

    if (loading) {
        return <div>Loading...🫣</div>;
    }

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
};
