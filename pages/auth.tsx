import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import initializeFirebaseClient from "../lib/initFirebase";
import { signInWithCustomToken } from "firebase/auth";

export default function Auth() {
    const router = useRouter();
    const { code } = router.query;
    const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));
    const [message, setMessage] = useState<string>("認証中です。");
    const [data, setData] = useState<any | undefined>(undefined);

    const getAccessToken = async (code: string) => {
        try {
            const response = await fetch(`/api/auth/getLineAccessToken?code=${code}`);
            const accessTokenData = await response.json();
            const statusCode = response.status;

            switch (statusCode) {
                case 200:
                    setMessage("LINEサーバーから正常にアクセストークンを取得しました。\nアクセストークンの検証をしています。");
                    setData(accessTokenData);
                    getCustomToken(accessTokenData.access_token);
                    break;
                case 400:
                    setMessage("リクエストに問題があります。リクエストパラメータとJSONの形式を確認してください。\n一定時間後にホームへ遷移します。");
                    await sleep(5000);
                    router.push('/');
                    break;
                case 401:
                    setMessage("Authorizationヘッダーを正しく送信していることを確認してください。\n一定時間後にホームへ遷移します。");
                    await sleep(5000);
                    router.push('/');
                    break;
                case 403:
                    setMessage("APIを使用する権限がありません。ご契約中のプランやアカウントに付与されている権限を確認してください。\n一定時間後にホームへ遷移します。");
                    await sleep(5000);
                    router.push('/');
                    break;
                case 429:
                    setMessage("大量のリクエストでレート制限を超過したため、一時的にリクエストを制限しています。\n一定時間後にホームへ遷移します。");
                    await sleep(5000);
                    router.push('/');
                    break;
                case 500:
                    setMessage("APIサーバーの一時的なエラーです。\n一定時間後にホームへ遷移します。");
                    await sleep(5000);
                    router.push('/');
                    break;
                default:
                    setMessage("予期しないエラーが発生しました。\n一定時間後にホームへ遷移します。");
                    await sleep(5000);
                    router.push('/');
                    break;
            }
        } catch (error) {
            setMessage("アクセストークンの取得時に内部エラーが発生しました。\n一定時間後にホームへ遷移します。");
            await sleep(5000);
            router.push('/');
        }
    };

    const getCustomToken = async (accessToken: string) => {
        try {
            const response = await fetch(`/api/auth/signIn?access_token=${accessToken}`);
            const res = await response.json();
            const statusCode = response.status;

            if (statusCode !== 200) {
                setMessage(`${res.error}\n一定時間後にホームへ遷移します。`);
                await sleep(5000);
                router.push('/');
                return;
            }

            const customToken = res.customToken;
            signIn(customToken);
        } catch (error) {
            console.log(error);
            setMessage("カスタムトークンの取得時に内部エラーが発生しました。\n一定時間後にホームへ遷移します。");
            await sleep(5000);
            router.push('/');
        }
    };

    const signIn = async (customToken: string) => {
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
            getAccessToken(code as string);
        }
    }, [code]);

    return (
        <div>
            {message}
        </div>
    );
}
