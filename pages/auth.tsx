import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import initializeFirebaseClient from "../lib/initFirebase";
import { signInWithCustomToken } from "firebase/auth";

export default function Auth() {
    const router = useRouter();
    const { code } = router.query;
    const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));
    const [message, setMessage] = useState<string>("認証中です。");

    const getCustomToken = async (code: string) => {
        try {
            const response = await fetch(`/api/auth/signInWithLine?code=${code}`);
            const res = await response.json();
            const statusCode = response.status;

            if (statusCode !== 200) {
                setMessage(`${res.error}\n一定時間後にホームへ遷移します。`);
                await sleep(5000);
                router.push('/');
                return;
            }

            const customToken = res.customToken;
            logIn(customToken);
        } catch (error) {
            console.log(error);
            setMessage("カスタムトークンの取得時に内部エラーが発生しました。\n一定時間後にホームへ遷移します。");
            await sleep(5000);
            router.push('/');
        }
    };

    const logIn = async (customToken: string) => {
        const { auth } = initializeFirebaseClient();
        try {
            await signInWithCustomToken(auth, customToken);
            setMessage("サインインに成功しました。リダイレクトしています...");
            router.push('/'); 
        } catch (error) {
            setMessage("サインイン時にエラーが発生しました。\n一定時間後にホームへ遷移します。");
            await sleep(5000);
            router.push('/');
        }
    };

    useEffect(() => {
        if (code) {
            getCustomToken(code as string);
        }
    }, [code]);

    return (
        <div>
            {message}
        </div>
    );
}
