import React, { useEffect, useState } from "react";
import { GetServerSideProps } from 'next';
import Link from "next/link";
import styles from "../styles/Style.module.css";
import Image from "next/image";
import Loading from "../components/loading";
import { useRouter } from "next/router";
import Header from "../components/header";
import Footer from "../components/footer";

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { eventID } = context.query;
    const baseUrl = context ? `http://${context.req.headers.host}` : 'http://localhost:3000';
    try {
        const response = await fetch(`${baseUrl}/api/events/getEventById?eventID=${eventID}`);
        if (!response.ok) {
            throw new Error('Failed to fetch event data');
        }
        const eventData = await response.json();
        return {
            props: {
                event: eventData,
            },
        };
    } catch (err) {
        return {
            props: {
                event: null,
            },
        };
    }
};

export default function EventPage({ event }: { event: any }) {
    const router = useRouter();
    const [targetEvent, setTargetEvent] = useState<any | null>(null);
    const [displayImg, setDisplayImg] = useState<string | undefined>("");
    const [isLoad, setIsLoad] = useState<boolean>(true);

    function formatUnixTime(unix: number) {
        const dateTime = new Date(unix * 1000);
        return (`${dateTime.getFullYear()
            }年${dateTime.getMonth() + 1
            }月${dateTime.getDate()
            }日 ${dateTime.getHours() < 10 ? 0 + String(dateTime.getHours()) : dateTime.getHours()
            }時${dateTime.getMinutes() < 10 ? 0 + String(dateTime.getMinutes()) : dateTime.getMinutes()
            }分`);
    }

    useEffect(() => {
        if (!event) {
            alert("イベントが取得できませんでした。");
            router.push("/");
            return;
        }
        if (event.images && event.images.length) setDisplayImg(event.images[0]);
        setTargetEvent(event);
        setIsLoad(false);
    }, [event]);


    return (
        <div className={styles.body}>
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
                                            {formatUnixTime(Number(targetEvent["endAt"]["seconds"]))}
                                        </div>
                                    </div>
                                    <div className={styles.hero_event_content_item}>
                                        <div className={styles.event_content_item_tittle}>
                                            公式YouTube 生放送日時
                                        </div>
                                        <div className={styles.event_content_item_text_red}>
                                            {`${formatUnixTime(Number(targetEvent["lotteryAt"]["seconds"]))}～`}
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
