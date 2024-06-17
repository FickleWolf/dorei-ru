import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, doc, getDoc, getDocs, orderBy, query, where } from "firebase/firestore";
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

    const storeAuthToken = async (idToken: string) => {
        try {
            const res = await fetch('/api/auth/handleAuthToken', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ idToken }),
            });

            const data = await res.json();

            return {
                statusCode: res.status,
                data,
            };
        } catch (error) {
            console.error('Error storing auth token:', error);
            return {
                statusCode: 500,
                data: { error: 'Internal Server Error' },
            };
        }
    };

    const clearAuthToken = async () => {
        try {
            const res = await fetch('/api/auth/handleAuthToken', { method: 'DELETE' });
            const data = await res.json();

            return {
                statusCode: res.status,
                data,
            };
        } catch (error) {
            console.error('Error clearing auth token:', error);
            return {
                statusCode: 500,
                data: { error: 'Internal Server Error' },
            };
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setLoading(true);
            setError(null);

            if (user) {
                setUser(user);

                const userDocRef = doc(db, "users", user.uid);
                try {
                    const userDocSnap = await getDoc(userDocRef);
                    if (userDocSnap.exists()) {
                        // ユーザー情報の取得
                        const userReadOnlyRef = doc(userDocRef, 'subcollection', 'readOnly');
                        const userReadOnlyDocSnap = await getDoc(userReadOnlyRef);

                        // 購入履歴の取得
                        const transactionsRef = query(
                            collection(db, "transactions"),
                            where("holder", "==", user.uid),
                            orderBy("createdAt", "desc")
                        );
                        const transactionsSnap = await getDocs(transactionsRef);
                        setUserData({
                            ...userDocSnap.data(),
                            ...userReadOnlyDocSnap.data(),
                            transactions: transactionsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
                        });

                        // トークンを取得して保存
                        const idToken = await user.getIdToken();
                        await storeAuthToken(idToken);
                    } else {
                        console.log("No such document!");
                        setError("No such document!");
                    }
                } catch (error) {
                    console.error("Error getting user document:", error);
                    setError("Error getting user document");
                }
            } else {
                setUser(null);
                setUserData(null);
                await clearAuthToken();
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
