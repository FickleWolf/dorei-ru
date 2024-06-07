import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import initFirebase from "../initFirebase";

const { auth, db } = initFirebase();

interface AuthContextType {
    user: User | null;
    userData: any | null;
    loading: boolean;
    error: string | null;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    userData: null,
    loading: true,
    error: null,
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user);
            setLoading(true);
            setError(null);

            if (user) {
                const userDocRef = doc(db, "users", user.uid);
                try {
                    const userDocSnap = await getDoc(userDocRef);
                    if (userDocSnap.exists()) {
                        const userReadOnlyRef = doc(userDocRef, 'subcollection', 'readOnly');
                        const userReadOnlyDocSnap = await getDoc(userReadOnlyRef);
                        setUserData({
                            ...userDocSnap.data(),
                            ...userReadOnlyDocSnap.data()
                        });
                    } else {
                        console.log("No such document!");
                        setError("No such document!");
                    }
                } catch (error) {
                    console.error("Error getting user document:", error);
                    setError("Error getting user document");
                }
            } else {
                setUserData(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, userData, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
