import initializeFirebaseClient from "../../../lib/initFirebase";
import { doc, getDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from 'next';

export default async function allEvents(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { db } = initializeFirebaseClient();
        const eventID = req.query["eventID"] as string;

        if (!eventID) {
            return res.status(400).json({ error: "Event ID is required" });
        }

        const eventsRef = doc(db, "events", eventID);
        const eventSnap = await getDoc(eventsRef);

        if (eventSnap.exists()) {
            return res.status(200).json({
                id: eventSnap.id,
                ...eventSnap.data()
            });
        } else {
            return res.status(404).json({ error: "Event not found" });
        }
    } catch (error) {
        console.error('Error fetching event:', error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
