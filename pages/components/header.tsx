import React, { useContext, useRef, useEffect, useState } from "react";
import styles from "../../styles/Home.module.css";
import Image from "next/image";
import initializeFirebaseClient from "../../lib/initFirebase";
import { PlatformSettingContext } from "../../lib/PlatformSetting";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightToBracket, faBars, faBell } from "@fortawesome/free-solid-svg-icons";
import {
    getDoc,
    doc,
    serverTimestamp,
    setDoc,
    query,
    collection,
    where,
    getDocs,
    updateDoc,
} from "firebase/firestore";

export default function Header() {
    const { auth, db } = initializeFirebaseClient();
    const { platformSetting, setPlatformSetting } = useContext(PlatformSettingContext);

    async function getPlatformSetting() {
        if (platformSetting) return;
        const platformSettingRef = doc(db, "platformSetting", "readOnly");
        const platformSettingSnap = await getDoc(platformSettingRef);
        if (platformSettingSnap.exists()) {
            setPlatformSetting({
                ...platformSettingSnap.data(),
            });
        }
        else{
            setPlatformSetting({
                eventCategories:[]
            });
        }
    }

    useEffect(() => {
        getPlatformSetting();
    }, []);

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
