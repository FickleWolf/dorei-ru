import { setCookie, destroyCookie } from 'nookies';
import { NextApiRequest, NextApiResponse } from 'next';
import initFirebaseAdmin from "../../../lib/initFirebaseAdmin";

export default async function handleAuthToken(req: NextApiRequest, res: NextApiResponse) {
    const { auth } = initFirebaseAdmin();

    if (req.method === 'POST') {
        const { idToken } = req.body;

        if (!idToken) return res.status(400).json({ error: 'idToken is required' });

        try {
            const decodedToken = await auth.verifyIdToken(idToken);

            setCookie({ res }, 'token', idToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                maxAge: 60 * 60 * 24 * 5,
                path: '/',
            });

            res.status(200).json({ message: 'Token set in cookie', decodedToken });
        } catch (error) {
            console.error('Error setting token:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else if (req.method === 'DELETE') {
        try {
            destroyCookie({ res }, 'token', {
                path: '/',
            });

            res.status(200).json({ message: 'Token cleared' });
        } catch (error) {
            console.error('Error clearing token:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
