import Link from 'next/link'
import styles from "../styles/Style.module.css";
import Image from "next/image";

export default function LineLoginButton() {
    const authUrl = {
        pathname: process.env.NEXT_PUBLIC_LINE_LOGIN_AUTHPAGE_BASEURL,
        query: {
            response_type: "code",
            client_id: process.env.NEXT_PUBLIC_LINE_LOGIN_CHANNEL_ID,
            redirect_uri: process.env.NEXT_PUBLIC_LINE_LOGIN_REDIRECTURL,
            state: "ssss",
            scope: "profile openid",
            bot_prompt: "aggressive",
            initial_amr_display: "lineqr"
        }
    }

    return (
        <Link
            href={authUrl}
            className={styles.login_button}>
            <Image
                alt="line_icon_img"
                width={30}
                height={30}
                src={`https://ficklewolf.com/dorei-ru/image/LINE-icon.png`}
                className={styles.login_button_icon}
            />
            <div className={styles.login_button_text}>Login/SignUp With LINE</div>
        </Link>
    );
}

