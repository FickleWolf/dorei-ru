import { useRouter } from "next/router";
import { useState } from "react";
import styles from "../styles/Style.module.css";
import initFirebase from "../lib/initFirebase";
import Loading from "./loading"; // Loadingコンポーネントをインポート
import { useAuth } from "../lib/provider/AuthProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faClockRotateLeft,
    faEnvelope,
    faAddressCard,
    faInfo,
    faCircleQuestion,
    faRightFromBracket,
    faXmark,
    faScrewdriverWrench
} from "@fortawesome/free-solid-svg-icons";

export default function Drawer({ closeDrawer, closeDrawerFunc }: { closeDrawer: boolean, closeDrawerFunc: () => void }) {
    const { auth } = initFirebase();
    const { userData } = useAuth();
    const [isLoad, setIsLoad] = useState<boolean>(false);
    const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));
    const router = useRouter();

    async function clearAuthToken() {
        try {
            const res = await fetch('/api/auth/handleAuthToken', { method: 'DELETE' });
            const data = await res.json();

            return {
                statusCode: res.status,
                data,
            };
        } catch (error) {
            console.error('Error clearing auth token:', error);
            return {
                statusCode: 500,
                data: { error: 'Internal Server Error' },
            };
        }
    }

    function AdminButton() {
        try {
            const roll = userData.roll;
            if (roll != "user") {
                return (
                    <div
                        className={styles.drawer_menu_item}
                        onClick={() => {
                            router.push("/admin_page");
                        }}
                    >
                        <div className={styles.drawer_menu_item_icon_block}>
                            <FontAwesomeIcon
                                icon={faScrewdriverWrench}
                                className={styles.drawer_menu_item_icon}
                            />
                        </div>
                        <div className={styles.drawer_menu_item_name}>
                            管理者画面
                        </div>
                    </div>
                );
            }
            else return null;
        } catch {
            return null;
        }
    }

    async function signOut() {
        setIsLoad(true);

        try {
            await clearAuthToken();
            await sleep(1000);
            auth.signOut();
            document.body.style.overflow = "auto";
        } catch (error) {
            console.error('Error signing out:', error);
            setIsLoad(false);
        }
    }

    if (isLoad) return <Loading />

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
                <AdminButton />
                <div className={styles.drawer_menu_item}
                    onClick={() => {
                        signOut();
                    }}>
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
