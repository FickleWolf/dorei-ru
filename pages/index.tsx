import { GetServerSideProps } from 'next';
import HomePage from "./home";

export default function Top({ eventsData }: { eventsData: any }) {
    return (
        <div>
            <HomePage eventsData={eventsData} />
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    try {
        const baseUrl = req ? `http://${req.headers.host}` : 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/events/getAllEvents`);

        if (!response.ok) {
            throw new Error('Failed to fetch events');
        }
        const eventsData = await response.json();

        return {
            props: {
                eventsData
            }
        };
    } catch (error) {
        console.error('Error fetching events:', error);
        return {
            props: {
                eventsData: []
            }
        };
    }
};
