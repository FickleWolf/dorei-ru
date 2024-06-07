import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/Style.module.css";
import Image from "next/image";
import Drawer from "../components/drawer";
import Login from "../components/login";
import { useAuth } from "../lib/provider/AuthProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faRightToBracket,
    faBars
} from "@fortawesome/free-solid-svg-icons";

export default function Header() {
    const router = useRouter();
    const { user } = useAuth();
    const [showDrawer, setShowDrawer] = useState<boolean>(false);
    const [closeDrawer, setCloseDrawer] = useState<boolean>(true);
    const [showLogin, setShowLogin] = useState<boolean>(false);
    const [closeLogin, setCloseLogin] = useState<boolean>(true);

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

    function closeLoginFunc() {
        (async () => {
            const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));
            setCloseLogin(true);
            await sleep(200);
        })().then(() => {
            document.body.style.overflow = "auto";
            setShowLogin(false);
        });
    }

    return (
        <>
            {showDrawer ? <Drawer closeDrawer={closeDrawer} closeDrawerFunc={closeDrawerFunc} /> : null}
            {showLogin ? <Login closeLogin={closeLogin} closeLoginFunc={closeLoginFunc} /> : null}
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
                        {!user ?
                            <FontAwesomeIcon
                                icon={faRightToBracket}
                                className={styles.header_btn_item}
                                onClick={() => {
                                    document.body.style.overflow = "hidden";
                                    setShowLogin(true);
                                    setCloseLogin(false);
                                }}
                            />
                            : null
                        }
                        {user ?
                            <FontAwesomeIcon
                                icon={faBars}
                                className={styles.header_btn_item}
                                onClick={() => {
                                    document.body.style.overflow = "hidden";
                                    setShowDrawer(true);
                                    setCloseDrawer(false);
                                }}
                            />
                            : null
                        }
                    </div>
                </div>
            </div>
        </>
    );
}


