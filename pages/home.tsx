import React, { useContext, useRef, useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import Loading from "../pages/components/loading";
import font from "../lib/font";
import initializeFirebaseClient from "../lib/initFirebase";
import { PlatformSettingContext } from "../lib/PlatformSetting";
import Header from "../pages/components/header";
import Footer from "../pages/components/footer";
import Event from "../pages/components/event";
import YouTube from "../pages/components/youtube";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faInfinity } from "@fortawesome/free-solid-svg-icons";
import {
    query,
    collection,
    where,
    getDocs,
    orderBy
} from "firebase/firestore";

export default function HomePage() {
    const { rocknRoll_One } = font();
    const { db } = initializeFirebaseClient();
    const { platformSetting } = useContext(PlatformSettingContext);
    const [sourceEvents, setSourceEvents] = useState<any[] | undefined>(undefined);
    const [displayEvents, setDisplayEvents] = useState<any[] | undefined>(undefined);
    const [isLoad, setIsLoad] = useState<boolean>(true);
    const [genre, setGenre] = useState<string>("全イベント一覧");

    async function getEvents() {
        const eventsRef = query(
            collection(db, "events"),
            where("status", "in",
                [
                    "Before_Publis",
                    "Publish_Available",
                    "Publish_Unavailable",
                    "WaitingTally"
                ]),
            orderBy("number")
        );
        await getDocs(eventsRef).then((events) => {
            const _events: any[] = [];
            events.forEach((event) =>
                _events.push({
                    id: event.id,
                    ...event.data()
                })
            );
            console.log(_events);
            setSourceEvents(_events);
            setDisplayEvents(_events);
        });
    }

    function changeGenre(genre: any) {
        const newEvents = sourceEvents.filter((event) =>
            event["category"]["id"] == genre["id"]
        );
        setDisplayEvents([
            ...newEvents
        ]);
        setGenre(`${genre["name"]} 一覧`);
    }

    useEffect(() => {
        if (sourceEvents == undefined) {
            (async () => {
                await getEvents();
            })();
        }
        if (platformSetting && sourceEvents) {
            setIsLoad(false);
        }
    }, [platformSetting]);

    return (
        <div className={`${styles.body} ${rocknRoll_One.className}`}>
            {isLoad ? <Loading /> : null}
            <Header />
            <div className={styles.container}>
                {!isLoad ?
                    <div className={styles.wrapper}>
                        <div className={styles.section_eyecatch}>
                            <div className={styles.eyecatch_image_area}>

                            </div>
                            <div className={styles.eyecatch_nav}>

                            </div>
                            <div className={styles.eyecatch_leftarrow}>
                                <FontAwesomeIcon
                                    icon={faChevronLeft}
                                    className={styles.eyecatch_arrow_icon}
                                />
                            </div>
                            <div className={styles.eyecatch_rightarrow}>
                                <FontAwesomeIcon
                                    icon={faChevronRight}
                                    className={styles.eyecatch_arrow_icon}
                                />
                            </div>
                        </div>
                        <div className={styles.section_hero}>
                            <div className={styles.hero_category}>
                                <div className={styles.hero_sidebar_tittle}>
                                    ジャンル
                                </div>
                                <div className={styles.hero_category_items}>
                                    <div className={styles.category_item}
                                        onClick={() => {
                                            setDisplayEvents(sourceEvents);
                                            setGenre("全イベント一覧");
                                        }}
                                    >
                                        <div className={styles.category_item_icon_block}>
                                            <FontAwesomeIcon
                                                icon={faInfinity}
                                                className={styles.category_item_icon} />
                                        </div>
                                        <div className={styles.category_item_text}>
                                            すべて表示
                                        </div>
                                    </div>
                                    {platformSetting["eventCategories"].map((category: any) =>
                                        <div
                                            className={styles.category_item}
                                            key={`enentCategory${category["id"]}`}
                                            onClick={() =>
                                                changeGenre(category)
                                            }
                                        >
                                            <div className={styles.category_item_icon_block}>
                                                <FontAwesomeIcon
                                                    icon={category["icon"]}
                                                    className={styles.category_item_icon} />
                                            </div>
                                            <div className={styles.category_item_text}>
                                                {category["name"]}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className={styles.hero_event_view}>
                                <div className={styles.hero_event_tittle}>
                                    {genre}
                                </div>
                                <div className={styles.hero_event_list}>
                                    {displayEvents.map((event) =>
                                        <Event
                                            event={event}
                                            key={`event_${event["id"]}`} />
                                    )}
                                </div>
                            </div>
                            <div className={styles.hero_social}>
                                <div className={styles.hero_sidebar_tittle}>
                                    Youtube
                                </div>
                                <div className={styles.social_content}>
                                    <YouTube />
                                </div>
                                <div className="g-ytsubscribe" data-channelid="UCxBUXC0jAd-f2oB2nhfdguQ" data-layout="full" data-count="default"></div>
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
