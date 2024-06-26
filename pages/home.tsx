import React, { useEffect, useState } from "react";
import styles from "../styles/Style.module.css";
import Image from "next/image";
import Loading from "../components/loading";
import Header from "../components/header";
import Footer from "../components/footer";
import Event from "../components/event";
import YouTube from "../components/youtube";
import { useAuth } from "../lib/provider/AuthProvider";
import { usePlatformSetting } from "../lib/provider/PlatformSettingProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faInfinity } from "@fortawesome/free-solid-svg-icons";

export default function HomePage({ eventsData }: { eventsData: any }) {
    const [sourceEvents, setSourceEvents] = useState<any[] | undefined>(undefined);
    const [displayEvents, setDisplayEvents] = useState<any[] | undefined>(undefined);
    const [isLoad, setIsLoad] = useState<boolean>(true);
    const [genre, setGenre] = useState<string>("全イベント一覧");
    const { platformSetting, loading: platformSettingLoading } = usePlatformSetting();
    const { loading: authLoading } = useAuth();

    const changeGenre = (genre: any) => {
        const newEvents = sourceEvents?.filter(event => event.category.id === genre.id) || [];
        setDisplayEvents(newEvents);
        setGenre(genre.name);
    };

    useEffect(() => {
        if (!sourceEvents) {
            setSourceEvents(eventsData);
            setDisplayEvents(eventsData);
        }
        if (sourceEvents) {
            setIsLoad(false);
        }
    }, [sourceEvents]);

    if (platformSettingLoading || authLoading || isLoad) return <Loading />

    return (
        <div className={styles.body}>
            <Header />
            <div className={styles.container}>
                <div className={styles.wrapper}>
                    <div className={styles.section_eyecatch}>
                        <div className={styles.eyecatch_image_area}></div>
                        <div className={styles.eyecatch_nav}></div>
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
                            <div className={styles.hero_sidebar_tittle}>ジャンル</div>
                            <div className={styles.hero_category_items}>
                                <div
                                    className={styles.category_item}
                                    onClick={() => {
                                        setDisplayEvents(sourceEvents);
                                        setGenre("全イベント一覧");
                                    }}
                                >
                                    <div className={styles.category_item_icon_block}>
                                        <FontAwesomeIcon
                                            icon={faInfinity}
                                            className={styles.category_item_icon}
                                        />
                                    </div>
                                    <div className={styles.category_item_text}>すべて表示</div>
                                </div>
                                {platformSetting.eventCategories.map((category: any) => (
                                    <div
                                        className={styles.category_item}
                                        key={`eventCategory${category.id}`}
                                        onClick={() => changeGenre(category)}
                                    >
                                        <div className={styles.category_item_icon_block}>
                                            <FontAwesomeIcon
                                                icon={category.icon}
                                                className={styles.category_item_icon}
                                            />
                                        </div>
                                        <div className={styles.category_item_text}>{category.name}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={styles.hero_event_view}>
                            <div className={styles.hero_event_tittle}>{genre}</div>
                            <div className={styles.hero_event_list}>
                                {displayEvents?.map((event) => (
                                    <Event event={event} key={`event_${event.id}`} />
                                ))}
                            </div>
                        </div>
                        <div className={styles.hero_social}>
                            <div className={styles.hero_sidebar_tittle}>Youtube</div>
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
                </div>
                <Footer />
            </div>
        </div>
    );
};
