/**
 * Authentication Context Provider
 * 
 * PURPOSE:
 * Manages user authentication state across the application using React Context.
 * Provides login,register, and logout functionality.
 * 
 * GREEN CODING:
 * - Session state cached in memory (reduces repeated Firebase calls)
 * - Firebase persistence handles local storage automatically
 * - Single auth listener for all components
 * 
 * VIVA EXPLANATION:
 * This context wraps the entire app and provides authentication state to all
 * components. It uses Firebase hooks to monitor auth changes and provides
 * methods for login, registration, and logout.
 */

import { createContext, useContext, useState, useEffect } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

// Create the authentication context
const AuthContext = createContext({});

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

/**
 * AuthProvider Component
 * Wraps the app and provides authentication state
 */
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    /**
     * Register a new user
     * GREEN CODING: Single Firebase call for auth + Firestore write
     */
    const register = async (email, password, name, role) => {
        try {
            // Create Firebase user account
            const result = await createUserWithEmailAndPassword(auth, email, password);
            const userId = result.user.uid;

            // Store user profile in Firestore (role, name, etc.)
            await setDoc(doc(db, 'users', userId), {
                uid: userId,
                email: email,
                name: name,
                role: role, // 'teacher' or 'student'
                createdAt: new Date().toISOString()
            });

            return { success: true, user: result.user };
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, error: error.message };
        }
    };

    /**
     * Login existing user
     * GREEN CODING: Firebase handles session caching automatically
     */
    const login = async (email, password) => {
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            return { success: true, user: result.user };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        }
    };

    /**
     * Logout current user
     */
    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            setUserRole(null);
            return { success: true };
        } catch (error) {
            console.error('Logout error:', error);
            return { success: false, error: error.message };
        }
    };

    /**
     * Fetch user role from Firestore
     * GREEN CODING: Called only once when user logs in
     */
    const fetchUserRole = async (userId) => {
        try {
            const userDoc = await getDoc(doc(db, 'users', userId));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                setUserRole(userData.role);
                return userData;
            }
        } catch (error) {
            console.error('Error fetching user role:', error);
        }
        return null;
    };

    /**
     * Monitor authentication state changes
     * GREEN CODING: Single listener for entire app lifecycle
     */
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                // Fetch user role from Firestore
                await fetchUserRole(currentUser.uid);
            } else {
                setUser(null);
                setUserRole(null);
            }
            setLoading(false);
        });

        // Cleanup listener on unmount
        return () => unsubscribe();
    }, []);

    // Context value provided to all children
    const value = {
        user,
        userRole,
        loading,
        register,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
