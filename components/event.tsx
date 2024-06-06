import styles from "../styles/Style.module.css";
import { useState, useEffect } from "react";
import Image from 'next/image';
import { useRouter } from "next/router";

export default function Event(event: any) {
    const router = useRouter();
    const [displayImg, setDisplayImg] = useState<string | undefined>(undefined);
    const [targetEvent, setTargetEvent] = useState<any | undefined>(undefined);

    function goEventPage() {
        router.push(
            {
                pathname: "/event_page",
                query: {
                    eventID: targetEvent["id"],
                },
            }
        );
    }

    function formatUnixTime(unix: number) {
        const dateTime = new Date(unix * 1000);
        return (`${dateTime.getFullYear()
            }年${dateTime.getMonth() + 1
            }月${dateTime.getDate()
            }日 ${dateTime.getHours()
            }時${dateTime.getMinutes()
            }分`);
    }

    useEffect(() => {
        if (targetEvent == undefined && displayImg == undefined) {
            if (event["event"]["images"] && event["event"]["images"].length) setDisplayImg(event["event"]["images"][0])
            setTargetEvent(event["event"]);
        }
    }, []);

    return (
        <div className={styles.event_item}>
            {targetEvent ?
                <div className={styles.event_item_inner}
                    onClick={() => {
                        goEventPage();
                    }}>
                    <div className={styles.event_item_head}>
                        <div className={styles.event_item_tittle}>
                            {`No.${targetEvent["number"]} ${targetEvent["name"]}`}
                        </div>
                        <div className={styles.event_item_price}>
                            {`${targetEvent["price"]}JPYC/口`}
                        </div>
                    </div>
                    <div className={styles.event_img_block}>
                        <div className={styles.event_img_display}>
                            <Image alt="eventImage"
                                width={300}
                                height={300}
                                src={displayImg}
                                className={styles.event_img}
                                priority={true}
                            />
                        </div>
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
                    </div>
                    <div className={styles.event_content}>
                        <div className={styles.event_content_participant}>
                            {`${targetEvent["couter"]} 人 / ${targetEvent["capacity"]} 人`}
                        </div>
                        <div className={styles.event_content_itemName}>
                            {targetEvent["itemName"]}
                        </div>
                        <div className={styles.event_content_description}>
                            {targetEvent["description"]}
                        </div>
                        <div className={styles.event_content_endAt}>
                            {`終了日時：${formatUnixTime(Number(targetEvent["endAt"]["seconds"]))}`}
                        </div>
                    </div>
                </div> : null
            }
        </div>
    );
}
