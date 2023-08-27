import React, { useContext, useRef, useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "../../styles/Home.module.css";
import Image from "next/image";
import initializeFirebaseClient from "../../lib/initFirebase";
import { PlatformSettingContext } from "../../lib/PlatformSetting";
import { getDoc, doc } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faRightToBracket,
    faBars,
    faClockRotateLeft,
    faEnvelope,
    faAddressCard,
    faInfo,
    faCircleQuestion,
    faRightFromBracket,
    faXmark
} from "@fortawesome/free-solid-svg-icons";

export default function Header() {
    const router = useRouter();
    const { auth, db } = initializeFirebaseClient();
    const { platformSetting, setPlatformSetting } = useContext(PlatformSettingContext);
    const [showDrawer, setShowDrawer] = useState<boolean>(false);
    const [closeDrawer, setCloseDrawer] = useState<boolean>(true);

    async function getPlatformSetting() {
        if (platformSetting) return;
        const platformSettingRef = doc(db, "platformSetting", "readOnly");
        const platformSettingSnap = await getDoc(platformSettingRef);
        if (platformSettingSnap.exists()) {
            setPlatformSetting({
                ...platformSettingSnap.data(),
            });
        }
        else {
            setPlatformSetting({
                eventCategories: []
            });
        }
    }

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

    useEffect(() => {
        getPlatformSetting();
    }, []);

    function Drawer() {
        return (
            <div className={!closeDrawer ? styles.drawer : styles.drawer_hidden}>
                <div className={styles.drawer_otehr}
                    onClick={() => {
                        closeDrawerFunc();
                    }}
                />
                <div className={styles.drawer_menu}>
                    <div className={styles.drawer_menu_header}>
                        <FontAwesomeIcon
                            icon={faXmark}
                            className={styles.drawer_menu_close}
                            onClick={() => {
                                closeDrawerFunc();
                            }}
                        />
                    </div>
                    <div className={styles.drawer_menu_item}>
                        <div className={styles.drawer_menu_item_icon_block}>
                            <FontAwesomeIcon
                                icon={faClockRotateLeft}
                                className={styles.drawer_menu_item_icon}
                            />
                        </div>
                        <div className={styles.drawer_menu_item_name}>
                            抽選履歴
                        </div>
                    </div>
                    <div className={styles.drawer_menu_item}>
                        <div className={styles.drawer_menu_item_icon_block}>
                            <FontAwesomeIcon
                                icon={faEnvelope}
                                className={styles.drawer_menu_item_icon}
                            />
                        </div>
                        <div className={styles.drawer_menu_item_name}>
                            メールボックス
                        </div>
                    </div>
                    <div className={styles.drawer_menu_item}>
                        <div className={styles.drawer_menu_item_icon_block}>
                            <FontAwesomeIcon
                                icon={faAddressCard}
                                className={styles.drawer_menu_item_icon}
                            />
                        </div>
                        <div className={styles.drawer_menu_item_name}>
                            登録情報の確認・変更
                        </div>
                    </div>
                    <div className={styles.drawer_menu_item}>
                        <div className={styles.drawer_menu_item_icon_block}>
                            <FontAwesomeIcon
                                icon={faInfo}
                                className={styles.drawer_menu_item_icon}
                            />
                        </div>
                        <div className={styles.drawer_menu_item_name}>
                            お問合せ・リクエスト
                        </div>
                    </div>
                    <div className={styles.drawer_menu_item}>
                        <div className={styles.drawer_menu_item_icon_block}>
                            <FontAwesomeIcon
                                icon={faCircleQuestion}
                                className={styles.drawer_menu_item_icon}
                            />
                        </div>
                        <div className={styles.drawer_menu_item_name}>
                            ヘルプ・よくある質問
                        </div>
                    </div>
                    <div className={styles.drawer_menu_item}>
                        <div className={styles.drawer_menu_item_icon_block}>
                            <FontAwesomeIcon
                                icon={faRightFromBracket}
                                className={styles.drawer_menu_item_icon}
                            />
                        </div>
                        <div className={styles.drawer_menu_item_name}>
                            ログアウト
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            {showDrawer ? <Drawer /> : null}
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


