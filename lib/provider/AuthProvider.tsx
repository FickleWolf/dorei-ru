import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import initFirebase from "../initFirebase";

const { auth, db } = initFirebase();

const AuthContext = createContext<{ user: User | null, userData: any | null }>({
    user: null,
    userData: null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<any | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user);
            if (user) {
                const userDocRef = doc(db, "users", user.uid);
                try {
                    const docSnap = await getDoc(userDocRef);
                    if (docSnap.exists()) {
                        setUserData(docSnap.data());
                    } else {
                        console.log("No such document!");
                    }
                } catch (error) {
                    console.error("Error getting user document:", error);
                }
            } else {
                setUserData(null);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, userData }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
