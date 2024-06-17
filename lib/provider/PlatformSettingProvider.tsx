import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { doc, getDoc } from "firebase/firestore";
import initFirebase from "../initFirebase";

const { db } = initFirebase();

type PlatformSettingContextType = {
    platformSetting: any | null;
    loading: boolean;
    error: string | null;
};

const PlatformSettingContext = createContext<PlatformSettingContextType>({
    platformSetting: null,
    loading: true,
    error: null,
});

export const PlatformSettingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [platformSetting, setPlatformSetting] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPlatformSetting = async () => {
            setLoading(true);
            setError(null);
            const platformSettingRef = doc(db, "platformSetting", "readOnly");
            try {
                const platformSettingSnap = await getDoc(platformSettingRef);
                if (platformSettingSnap.exists()) {
                    setPlatformSetting(platformSettingSnap.data());
                } else {
                    setError("No such document!");
                }
            } catch (error) {
                setError(`Error getting platformSetting document: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        if (platformSetting == null) {
            fetchPlatformSetting();
        }
    }, [platformSetting]);

    return (
        <PlatformSettingContext.Provider value={{ platformSetting, loading, error }}>
            {children}
        </PlatformSettingContext.Provider>
    );
};

export const usePlatformSetting = () => useContext(PlatformSettingContext);
