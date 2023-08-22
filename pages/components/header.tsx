import styles from "../../styles/Home.module.css";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightToBracket,faBars,faBell } from "@fortawesome/free-solid-svg-icons";

export default function Header() {
    return (
        <div className={styles.header}>
            <div className={styles.header_container}>
                <div className={styles.header_wrapper}>
                    <div>
                        <Image
                            alt="icon"
                            width={0}
                            height={0}
                            src={`DoreiRu_logo.png`}
                            className={styles.header_logo_icon}
                        />
                    </div>
                    <div className={styles.header_logo_text}>
                        <div>
                            Dorei-Ru.com
                        </div>
                    </div>
                </div>
                <div className={`${styles.header_wrapper} ${styles.header_btn}`}>
                    <FontAwesomeIcon
                        icon={faRightToBracket}
                        className={styles.header_btn_item}
                    />
                    <FontAwesomeIcon
                        icon={faBars}
                        className={styles.header_btn_item}
                    />
                    <FontAwesomeIcon
                        icon={faBell}
                        className={styles.header_btn_item}
                    />
                </div>
            </div>
        </div>
    );
}
