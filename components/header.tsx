import React, { useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/Style.module.css";
import Image from "next/image";
import Drawer from "../components/drawer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faRightToBracket,
    faBars
} from "@fortawesome/free-solid-svg-icons";

export default function Header() {
    const router = useRouter();
    const [showDrawer, setShowDrawer] = useState<boolean>(false);
    const [closeDrawer, setCloseDrawer] = useState<boolean>(true);

    function closeDrawerFunc() {
        (async () => {
            const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));
            setCloseDrawer(true);
            await sleep(200);
        })().then(() => {
            document.body.style.overflow = "auto";
            setShowDrawer(false);
        });
    }

    return (
        <>
            {showDrawer ? <Drawer closeDrawer={closeDrawer} closeDrawerFunc={closeDrawerFunc} /> : null}
            <div className={styles.header}>
                <div className={styles.header_container}>
                    <div className={styles.header_wrapper}
                        onClick={() => router.push({
                            pathname: "/"
                        })}>
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
                            onClick={() => {
                                document.body.style.overflow = "hidden";
                                setShowDrawer(true);
                                setCloseDrawer(false);
                            }}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}


