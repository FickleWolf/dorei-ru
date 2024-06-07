import { useRouter } from "next/router";
import styles from "../styles/Style.module.css";
import initFirebase from "../lib/initFirebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faClockRotateLeft,
    faEnvelope,
    faAddressCard,
    faInfo,
    faCircleQuestion,
    faRightFromBracket,
    faXmark
} from "@fortawesome/free-solid-svg-icons";

export default function Drawer({ closeDrawer, closeDrawerFunc }: { closeDrawer: boolean, closeDrawerFunc: () => void }) {
    const { auth } = initFirebase();
    const router = useRouter();

    function signOut() {
        auth.signOut();
        router.reload();
    }

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