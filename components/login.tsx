import styles from "../styles/Style.module.css";
import Image from "next/image";
import LineLoginButton from "./lineLoginButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownLeftAndUpRightToCenter } from "@fortawesome/free-solid-svg-icons";
import { faTwitter, faLine, faYoutube } from "@fortawesome/free-brands-svg-icons";

export default function Login({ closeLogin, closeLoginFunc }: { closeLogin: boolean, closeLoginFunc: () => void }) {
    return (
        <div className={!closeLogin ? styles.login : styles.login_hidden}>
            <div className={styles.login_content}>
                <head className={styles.login_header}>
                    <div className={styles.login_header_logo}>
                        <Image
                            alt="logo_img"
                            width={45}
                            height={45}
                            src={`DoreiRu_logo.png`}
                            className={styles.login_header_logo_img}
                        />
                        <div className={styles.login_header_logo_text}>
                            Dorei-Ru.com
                        </div>
                    </div>
                    <div
                        className={styles.login_header_close}
                        onClick={() => {
                            closeLoginFunc();
                        }}>
                        <FontAwesomeIcon
                            icon={faDownLeftAndUpRightToCenter}
                            className={styles.login_header_close_icon}
                        />
                    </div>
                </head>
                <div className={styles.login_body}>
                    <div className={styles.login_body_hero}>
                        <LineLoginButton />
                    </div>
                    <div className={styles.login_body_hero}>
                        <div className={styles.login_demo_button}>
                            テスト用ユーザーでログイン
                        </div>
                    </div>
                </div>
                <footer className={styles.login_footer}>
                    <div className={styles.login_footer_social}>
                        <FontAwesomeIcon
                            icon={faYoutube}
                            className={styles.login_footer_nav_social}
                        />
                        <FontAwesomeIcon
                            icon={faTwitter}
                            className={styles.login_footer_nav_social}
                        />
                        <FontAwesomeIcon
                            icon={faLine}
                            className={styles.login_footer_nav_social}
                        />
                    </div>
                    <div className={styles.login_footer_creadit}>
                        © 2023 DoreiRu.com All rights reserved.
                    </div>
                </footer>
            </div>
        </div>
    );
}