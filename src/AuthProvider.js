import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth as useFirebaseAuth } from './firebase';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const { currentUser, signup, login, logout } = useFirebaseAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (currentUser !== undefined) {
            console.log("Current user:", currentUser);
            setLoading(false);
        }
    }, [currentUser]);

    const value = {
        currentUser,
        signup,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
