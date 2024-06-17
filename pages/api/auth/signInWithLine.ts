import Stripe from 'stripe';
import initFirebaseAdmin from "../../../lib/initFirebaseAdmin";
import { NextApiRequest, NextApiResponse } from 'next';
import { parseCookies, destroyCookie } from 'nookies';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-04-10',
});

export default async function signInWithLine(req: NextApiRequest, res: NextApiResponse) {
    //クッキーでの認証
    const cookies = parseCookies({ req });
    const { state: storedState } = cookies;
    const returnedState = req.query["state"] as string;
    if (storedState !== returnedState) {
        return res.status(400).json({ error: 'Invalid state parameter' });
    }
    destroyCookie({ res }, 'state');

    const code = req.query["code"] as string;
    const accessToken = await getAccessToken(code);
    if (accessToken.statusCode !== 200) {
        res.status(accessToken.statusCode).json({ error: accessToken.data || 'Failed to verify access token' });
        return;
    }

    const profile = await verifyAndGetLineProfile(accessToken.data.id_token);
    if (profile.statusCode !== 200) {
        res.status(profile.statusCode).json({ error: profile.data.error || 'Failed to verify access token' });
        return;
    }

    if (profile.data.aud === process.env.NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID && profile.data.exp > 0) {
        const uid = profile.data.sub;
        const userCreated = await createUserInFirestoreIfNotExists(uid, profile.data);

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

async function getAccessToken(code: string) {
    const data = new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: process.env.NEXT_PUBLIC_LINE_LOGIN_REDIRECTURL,
        client_id: process.env.NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID,
        client_secret: process.env.NEXT_PUBLIC_LINE_LOGIN_KEY,
    });

    try {
        const apiUrl = `${process.env.NEXT_PUBLIC_LINE_LOGIN_API_BASEURL}/token`;
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: data,
        });

        const responseData = await response.json();
        return {
            statusCode: response.status,
            data: responseData
        };
    } catch (error) {
        console.error('Error getting access token:', error);
        return {
            statusCode: 500,
            data: { error: 'Internal error occurred while getting access token' }
        };
    }
}

async function verifyAndGetLineProfile(idToken: string) {
    const data = new URLSearchParams({
        id_token: idToken,
        client_id: process.env.NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID,
    });
    try {
        const apiUrl = `${process.env.NEXT_PUBLIC_LINE_LOGIN_API_BASEURL}/verify`;
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: data
        });
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

async function createStripeCustomer(userInfo: any) {
    try {
        const customer = await stripe.customers.create({
            email: userInfo.email,
            name: userInfo.name,
        });
        return {
            statusCode: 200,
            data: customer,
        };
    } catch (error) {
        console.error('Error creating Stripe customer:', error);
        return {
            statusCode: 500,
            data: { error: 'Internal error occurred while creating Stripe customer' },
        };
    }
}

async function createUserInFirestoreIfNotExists(uid: string, userInfo: any) {
    const { db } = initFirebaseAdmin();
    const userRef = db.collection('users').doc(uid);
    try {
        const doc = await userRef.get();
        let stripeCustomerId = '';
        if (!doc.exists) {
            const stripeCustomer = await createStripeCustomer(userInfo);
            if (stripeCustomer.statusCode !== 200 || 'error' in stripeCustomer.data) {
                throw new Error('Failed to create Stripe customer');
            }
            stripeCustomerId = stripeCustomer.data.id;
            await userRef.set({
                name: userInfo.name,
                email: userInfo.email,
                stripeCustomerId: stripeCustomerId,
                roll: "user",
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const userReadOnlyRef = userRef.collection('subcollection').doc('readOnly');
            await userReadOnlyRef.set({
                freeCoinBlance: 0,
                paidCoinBlance: 0,
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
            data: { customToken },
        };
    } catch (error) {
        console.error('Error generating custom token:', error);
        return {
            statusCode: 500,
            data: { error: 'Internal error occurred while generating custom token' },
        };
    }
}
