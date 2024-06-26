import { initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";
import { FirebaseStorage, getStorage } from "firebase/storage";

export default function initializeFirebaseClient(): {
    storage: FirebaseStorage;
    db: Firestore;
    auth: Auth;
} {
    const firebaseApp = initializeApp(
        {
            apiKey: process.env.NEXT_PUBLIC_API_KEY,
            authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
            projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
            storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
            messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
            appId: process.env.NEXT_PUBLIC_APP_ID,
        },
        "Doire-Ru.com"
    );

    const storage = getStorage(firebaseApp);
    const db = getFirestore(firebaseApp);
    const auth = getAuth(firebaseApp);

    return {
        storage,
        db,
        auth,
    };
}
