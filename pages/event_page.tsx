import React, { useContext, useRef, useEffect, useState } from "react";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import Loading from "../pages/components/loading";
import font from "../lib/font";
import initializeFirebaseClient from "../lib/initFirebase";
import { useRouter } from "next/router";
import Header from "../pages/components/header";
import Footer from "../pages/components/footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faInfinity } from "@fortawesome/free-solid-svg-icons";
import {
    doc,
    getDoc
} from "firebase/firestore";

export default function HomePage() {
    const router = useRouter();
    const { rocknRoll_One } = font();
    const { db } = initializeFirebaseClient();
    const [targetEvent, setTargetEvent] = useState<any | undefined>(undefined);
    const [displayImg, setDisplayImg] = useState<string | undefined>(undefined);
    const [isLoad, setIsLoad] = useState<boolean>(true);

    async function getEvent(eventID: string) {
        const eventsRef = doc(db, "events", eventID);
        const eventSanp = await getDoc(eventsRef);
        if (eventSanp.exists()) {
            setTargetEvent({
                id: eventSanp.id,
                ...eventSanp.data()
            });
            //eventのトップ画像を表示
            eventSanp.data()["images"] && eventSanp.data()["images"].length ?
                setDisplayImg(eventSanp.data()["images"][0])
                : setDisplayImg("");
            setTargetEvent(eventSanp.data());

            setIsLoad(false);
        }
        else {
            alert("イベントが取得できませんでした。\nホーム画面に遷移します。");
            router.push({
                pathname: "/"
            });
            return;
        }
    }

    function unixToStoring(unix: number) {
        const dateTime = new Date(unix * 1000);
        return (`${dateTime.getFullYear()
            }年${dateTime.getMonth() + 1
            }月${dateTime.getDate()
            }日 ${dateTime.getHours() < 10 ? 0 + String(dateTime.getHours()) : dateTime.getHours()
            }時${dateTime.getMinutes() < 10 ? 0 + String(dateTime.getMinutes()) : dateTime.getMinutes()
            }分`);
    }

    useEffect(() => {
        const eventID = router.query.eventID as string
        if (eventID != undefined && targetEvent == undefined) {
            if (eventID == "") {
                router.push({
                    pathname: "/"
                });
                return;
            }
            getEvent(eventID);
        }
    }, [router]);

    return (
        <div className={`${styles.body} ${rocknRoll_One.className}`}>
            {isLoad ? <Loading /> : null}
            <Header />
            <div className={styles.container}>
                {!isLoad ?
                    <div className={styles.wrapper}>
                        <div className={styles.section_event}>
                            <div className={styles.hero_event}>
                                <div className={styles.hero_event_img}>
                                    <div className={styles.event_img_block}>
                                        {targetEvent["images"] && targetEvent["images"].length > 0 ?
                                            <div className={styles.event_img_selector}>
                                                {targetEvent["images"].map((img: string, index: number) =>
                                                    <div
                                                        key={`selectableImg${index}`}
                                                        className={img == displayImg ?
                                                            styles.event_img_selector_item_selected
                                                            : styles.event_img_selector_item

                                                        }
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setDisplayImg(img);
                                                        }}>
                                                        <Image alt="eventImage"
                                                            width={150}
                                                            height={150}
                                                            src={img}
                                                            className={styles.event_img_selector_item_img}
                                                            priority={true}
                                                        />
                                                    </div>
                                                )}
                                            </div> : null
                                        }
                                        <div className={styles.event_img_display}>
                                            <Image alt="eventImage"
                                                width={300}
                                                height={300}
                                                src={displayImg}
                                                className={styles.event_img}
                                                priority={true}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.hero_event_content}>
                                    <div className={styles.hero_event_content_head}>
                                        <div className={styles.event_content_head_name}>
                                            <div>{`No.${targetEvent["number"]}`}</div>
                                            <div>{`${targetEvent["name"]}`}</div>
                                        </div>
                                        <div className={styles.event_content_head_itemName}>
                                            {targetEvent["itemName"]}
                                        </div>
                                    </div>
                                    <div className={styles.hero_event_content_item}>
                                        <div className={styles.event_content_item_tittle}>
                                            値段
                                        </div>
                                        <div className={styles.event_content_item_text_red}>
                                            {`${targetEvent["price"]}JPYC/口`}
                                        </div>
                                    </div>
                                    <div className={styles.hero_event_content_item}>
                                        <div className={styles.event_content_item_tittle}>
                                            現在の当選確率
                                        </div>
                                        <div className={styles.event_content_item_text_red}>
                                            {`1/${targetEvent["couter"]} (参加者:${targetEvent["couter"]}人/定員:${targetEvent["capacity"]}人)`}
                                        </div>
                                    </div>
                                    <div className={styles.hero_event_content_item}>
                                        <div className={styles.event_content_item_tittle}>
                                            終了日時
                                        </div>
                                        <div className={styles.event_content_item_text_red}>
                                            {unixToStoring(Number(targetEvent["endAt"]["seconds"]))}
                                        </div>
                                    </div>
                                    <div className={styles.hero_event_content_item}>
                                        <div className={styles.event_content_item_tittle}>
                                            公式YouTube 生放送日時
                                        </div>
                                        <div className={styles.event_content_item_text_red}>
                                            {`${unixToStoring(Number(targetEvent["lotteryAt"]["seconds"]))}～`}
                                        </div>
                                    </div>
                                    <div className={styles.hero_event_content_item}>
                                        <div className={styles.event_content_item_tittle}>
                                            この商品について
                                        </div>
                                        <div className={styles.event_content_item_text}>
                                            {targetEvent["description"]}
                                        </div>
                                    </div>
                                    <div className={styles.hero_event_content_item}>
                                        <div
                                            className={styles.event_content_item_tittle}
                                            style={{ color: "#dc395f" }}>
                                            注意事項
                                        </div>
                                        <ul className={styles.event_content_item_text}>
                                            <li>落選時の賞品の引き渡しはございません。</li>
                                            <li>イベント購入後の、返金・キャンセルは原則受け付けません。</li>
                                            <li>登録情報に誤記・不備がる場合、当選時の賞品が受け取れず、賞品に関する一切の権利を失う場合があります。</li>
                                            <li>抽選時の演出・登録情報の確認のためカスタマーサポートからご連絡をさせていただく場合がございます。</li>
                                            <li>抽選時の演出のため、ユーザーネーム・生年月日等の個人が特定できない登録情報を利用する場合があります。</li>
                                        </ul>
                                    </div>
                                    <div className={styles.hero_event_content_item}>
                                        <div className={styles.event_content_item_tittle}>
                                            特定商取引法に基づく表記
                                        </div>
                                        <Link
                                            href="/regulation"
                                            className={styles.event_content_item_link}
                                        >
                                            https://dorei-ru.com/regulation
                                        </Link>
                                    </div>
                                    <div className={styles.hero_event_content_item}>
                                        <div className={styles.event_content_item_tittle}>
                                            会員規約
                                        </div>
                                        <Link
                                            href="/term"
                                            className={styles.event_content_item_link}
                                        >
                                            https://dorei-ru.com/terms
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.section_event_purchase}>
                                <div className={styles.event_purchase_note}>
                                    イベントを購入するには、ログインしている必要があります。
                                    <br />画面右上のボタンよりログイン・サインアップを行ってください。
                                </div>
                                <div className={styles.event_purchase_button}>
                                    イベント購入
                                </div>
                            </div>
                        </div>
                        <div className={styles.section_img}>
                            <Image
                                alt="footer_img"
                                width={1600}
                                height={400}
                                src={`https://ficklewolf.com/dorei-ru/image/HowToUse.png`}
                                className={styles.footer_img}
                                priority={true}
                            />
                        </div>
                    </div> : null
                }
                <Footer />
            </div>
        </div>
    );
}
