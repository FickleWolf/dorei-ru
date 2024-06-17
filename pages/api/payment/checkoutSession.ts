import { NextApiRequest, NextApiResponse } from 'next';
import initFirebaseAdmin from "../../../lib/initFirebaseAdmin";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2024-04-10',
});

export default async function checkoutSession(req: NextApiRequest, res: NextApiResponse) {
    const { db } = initFirebaseAdmin();
    const uid = req.query["userId"] as string;
    const priceId = req.query["stripe_id"] as string;

    try {
        const userDoc = await db.collection('users').doc(uid).get();
        if (!userDoc.exists) {
            return res.status(400).send('User not found');
        }

        const customerId = userDoc.data().stripeCustomerId;

        if (req.method === 'POST') {
            const session = await stripe.checkout.sessions.create({
                customer: customerId,
                submit_type: 'pay',
                line_items: [
                    {
                        price: priceId,
                        quantity: 1,
                    },
                ],
                mode: 'payment',
                success_url: `${req.headers.origin}/?success=true`,
                cancel_url: `${req.headers.origin}/?canceled=true`,
            });
            res.status(200).json(session);
        } else {
            res.setHeader('Allow', 'POST');
            res.status(405).end('Method Not Allowed');
        }
    } catch (err: any) {
        res.status(err.statusCode || 500).json({ error: err.message });
    }
}
