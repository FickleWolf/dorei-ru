import { NextApiRequest, NextApiResponse } from 'next';
import initFirebaseAdmin from "../../../lib/initFirebaseAdmin";

export default async function signIn(req: NextApiRequest, res: NextApiResponse) {
    const accessToken = req.query["access_token"] as string;
    const verify = await verifyLineAccessToken(accessToken);

    if (verify.statusCode !== 200) {
        res.status(verify.statusCode).json({ error: verify.data.error || 'Failed to verify access token' });
        return;
    }

    if (verify.data.client_id === process.env.NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID && verify.data.expires_in > 0) {
        const userinfoData = await getProfile(accessToken);
        if (userinfoData.statusCode !== 200) {
            res.status(userinfoData.statusCode).json({ error: userinfoData.data.error || 'Failed to retrieve user information' });
            return;
        }

        const uid = userinfoData.data.sub;
        const userCreated = await createUserInFirestoreIfNotExists(uid, userinfoData.data);

        if (!userCreated) {
            res.status(500).json({ error: 'Failed to create or retrieve user in Firestore' });
            return;
        }

        const customToken = await generateCustomToken(uid);
        res.status(customToken.statusCode).json(customToken.data);
    } else {
        res.status(401).json({ error: 'Invalid access token' });
    }
}

async function verifyLineAccessToken(accessToken: string) {
    try {
        const apiUrl = `${process.env.NEXT_PUBLIC_LINE_LOGIN_API_BASEURL}/verify?access_token=${accessToken}`;
        const response = await fetch(apiUrl);
        const responseData = await response.json();
        return {
            statusCode: response.status,
            data: responseData
        };
    } catch (error) {
        console.error('Error verifying access token:', error);
        return {
            statusCode: 500,
            data: { error: 'Internal error occurred while verifying access token' }
        };
    }
}

async function getProfile(accessToken: string) {
    try {
        const apiUrl = `${process.env.NEXT_PUBLIC_LINE_LOGIN_API_BASEURL}/userinfo`;
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });
        const responseData = await response.json();
        return {
            statusCode: response.status,
            data: responseData
        };
    } catch (error) {
        console.error('Error retrieving user profile:', error);
        return {
            statusCode: 500,
            data: { error: 'Internal error occurred while retrieving user profile' }
        };
    }
}

async function createUserInFirestoreIfNotExists(uid: string, userInfo: any) {
    const { db } = initFirebaseAdmin();
    const userRef = db.collection('users').doc(uid);
    try {
        const doc = await userRef.get();
        if (!doc.exists) {
            await userRef.set({
                name:userInfo.name,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });
        } else {
            await userRef.update({
                updatedAt: new Date().toISOString(),
            });
        }
        return true;
    } catch (error) {
        console.error('Error creating or updating user in Firestore:', error);
        return false;
    }
}

async function generateCustomToken(uid: string) {
    const { auth } = initFirebaseAdmin();
    const additionalClaims = {
        premiumAccount: true,
    };
    try {
        const customToken = await auth.createCustomToken(uid, additionalClaims);
        return {
            statusCode: 200,
            data: { customToken }
        };
    } catch (error) {
        console.error('Error generating custom token:', error);
        return {
            statusCode: 500,
            data: { error: 'Internal error occurred while generating custom token' }
        };
    }
}
