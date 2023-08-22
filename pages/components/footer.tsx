import styles from "../../styles/Home.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faLine, faYoutube } from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
    return (
        <div className={styles.footer}>
            <div className={styles.footer_container}>
                <div className={styles.footer_nav}>
                    <div className={styles.footer_nav_item}>
                        会員規約
                    </div>
                    <div className={styles.footer_nav_item}>
                        プライバシーポリシー
                    </div>
                    <div className={styles.footer_nav_item}>
                        特定商取引法に基づく表記
                    </div>
                </div>
                <div className={styles.footer_social}>
                    <FontAwesomeIcon
                        icon={faYoutube}
                        className={styles.footer_nav_social}
                    />
                    <FontAwesomeIcon
                        icon={faTwitter}
                        className={styles.footer_nav_social}
                    />
                    <FontAwesomeIcon
                        icon={faLine}
                        className={styles.footer_nav_social}
                    />
                </div>
                <div className={styles.footer_creadit}>
                    © 2023 DoreiRu.com All rights reserved.
                </div>
            </div>
        </div>
    );
}
