import initializeFirebaseClient from "../../../lib/initFirebase";
import {
    query,
    collection,
    where,
    getDocs,
    orderBy
} from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from 'next';

export default async function allEvents(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { db } = initializeFirebaseClient();
        const eventsRef = query(
            collection(db, "events"),
            where("status", "in", [
                "Before_Publish",
                "Publish_Available",
                "Publish_Unavailable",
                "WaitingTally"
            ]),
            orderBy("number")
        );

        const eventsSnapshot = await getDocs(eventsRef);
        const eventsData = eventsSnapshot.docs.map((event) => ({
            id: event.id,
            ...event.data()
        }));

        res.status(200).json(eventsData);
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ error: "Error fetching events" });
    }
}
