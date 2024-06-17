import { useRouter } from "next/router";
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import Loading from "../components/loading";
import initFirebaseAdmin from "../lib/initFirebaseAdmin";
import { useEffect } from "react";

export default function AdminPage({ isAccess }: { isAccess: boolean }) {
    const router = useRouter();

    useEffect(() => {
        if (!isAccess) {
            alert("アクセスする権限がありません。");
            router.push("/");
        }
    }, []);

    if (!isAccess) return <Loading />;

    return (
        <div>
            管理者ページ
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    const { auth, db } = initFirebaseAdmin();
    const cookies = parseCookies({ req });
    const token = cookies.token;

    if (!token) {
        return {
            props: {
                isAccess: false,
            },
        };
    }

    try {
        const decodedToken = await auth.verifyIdToken(token);
        const uid = decodedToken.uid;
        const userDocRef = db.collection("users").doc(uid);
        const userDocSnap = await userDocRef.get();

        if (userDocSnap.exists && userDocSnap.data()?.roll === "admin") {
            return {
                props: {
                    isAccess: true,
                },
            };
        } else {
            return {
                props: {
                    isAccess: false,
                },
            };
        }
    } catch (error) {
        console.error("Error verifying token or fetching user data:", error);
        return {
            props: {
                isAccess: false,
            },
        };
    }
};
