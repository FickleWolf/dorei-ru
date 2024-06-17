import crypto from 'crypto';
import { setCookie } from 'nookies';
import { NextApiRequest, NextApiResponse } from 'next';

export default function getLineAuthUrl(req: NextApiRequest, res: NextApiResponse) {
    const state = crypto.randomBytes(16).toString('hex');

    setCookie({ res }, 'state', state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 300,
    });

    const authUrl = `${process.env.NEXT_PUBLIC_LINE_LOGIN_AUTHPAGE_BASEURL}?response_type=code&client_id=${process.env.NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID}&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_LINE_LOGIN_REDIRECTURL)}&state=${state}&scope=profile%20openid%20email&bot_prompt=aggressive&initial_amr_display=lineqr`;

    res.status(200).json({ url: authUrl });
}
