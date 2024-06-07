import { NextApiRequest, NextApiResponse } from 'next';

export default async function getAccessToken(req: NextApiRequest, res: NextApiResponse) {
    const code = req.query["code"] as string;
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

        res.status(response.status).json(responseData);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
}
