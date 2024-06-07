import React, { useContext, useEffect } from "react";
import HomePage from "./home";
import { GetServerSideProps } from 'next';
import { PlatformSettingContext } from '../lib/provider/PlatformSettingProvider';
import initializeFirebaseClient from '../lib/initFirebase';
import { doc, getDoc } from 'firebase/firestore';

export default function Top({ platformSettings, eventsData }: { platformSettings: any, eventsData: any }) {
    const { setPlatformSetting } = useContext(PlatformSettingContext);

    useEffect(() => {
        setPlatformSetting(platformSettings);
    }, [platformSettings, setPlatformSetting]);

    return (
        <div>
            <HomePage eventsData={eventsData} />
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    try {
        const { db } = initializeFirebaseClient();
        const platformSettingRef = doc(db, 'platformSetting', 'readOnly');
        const platformSettingSnap = await getDoc(platformSettingRef);
        const platformSettings = platformSettingSnap.exists()
            ? platformSettingSnap.data()
            : null;

        const baseUrl = req ? `http://${req.headers.host}` : 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/events/getAllEvents`);
        if (!response.ok) {
            throw new Error('Failed to fetch events');
        }
        const eventsData = await response.json();

        return {
            props: {
                platformSettings,
                eventsData
            }
        };
    } catch (error) {
        console.error('Error fetching platform settings or events:', error);
        return {
            props: {
                platformSettings: null,
                eventsData: []
            }
        };
    }
};
