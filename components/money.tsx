import React, { useContext, useEffect, useState } from "react";
import styles from "../styles/Style.module.css";
import Image from "next/image";
import { PlatformSettingContext } from '../lib/provider/PlatformSettingProvider';
import { useAuth } from "../lib/provider/AuthProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faCoins, faCartShopping, faChevronRight, faCashRegister } from "@fortawesome/free-solid-svg-icons";

export default function Money({ closeMoney, closeMoneyFunc }: { closeMoney: boolean, closeMoneyFunc: () => void }) {
    const { platformSetting } = useContext(PlatformSettingContext);
    const [coinShowCase, setCoinShowCase] = useState<any>([]);
    const { user, userData } = useAuth();

    useEffect(() => {
        if (coinShowCase.length == 0 && platformSetting) {
            setCoinShowCase(platformSetting.coinShowCase)
        }
    }, [platformSetting])

    if (!userData) return;

    return (
        <div className={!closeMoney ? styles.money : styles.money_hidden}>
            <div className={styles.money_content}>
                <div
                    className={styles.money_close}
                    onClick={() => {
                        closeMoneyFunc();
                    }}>
                    <FontAwesomeIcon
                        icon={faXmark}
                        className={styles.money_close_icon}
                    />
                </div>
                <div className={styles.money_body}>
                    <div className={styles.money_body_head}>コインの購入・取得履歴</div>
                    <div className={styles.money_hero}>
                        <div className={styles.money_account}>
                            <Image
                                alt="account_img"
                                width={45}
                                height={45}
                                src={`userIcon.png`}
                                className={styles.money_account_img}
                            />
                            <div className={styles.money_account_content}>
                                <div className={styles.money_account_user}>{userData.name}</div>
                                <div className={styles.money_account_coin}>
                                    <FontAwesomeIcon
                                        icon={faCoins}
                                        className={styles.money_icon}
                                    />
                                    <div className={styles.money_account_coin_blance}>
                                        <div className={styles.money_account_coin_blance_text}>
                                            {userData.freeCoinBlance + userData.paidCoinBlance}
                                        </div>
                                        <div className={styles.money_account_coin_blance_breakdown}>
                                            {`(有償：${userData.paidCoinBlance}・無償：${userData.freeCoinBlance})`}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.money_transition}>
                            <div className={styles.money_transition_item}>
                                <div className={styles.money_transition_item_left}>
                                    <FontAwesomeIcon
                                        icon={faCartShopping}
                                        className={styles.money_icon}
                                    />
                                    <div className={styles.money_transition_item_text}>コイン購入</div>
                                </div>
                                <FontAwesomeIcon
                                    icon={faChevronRight}
                                    className={styles.money_icon}
                                />
                            </div>
                            <div className={styles.money_transition_item}>
                                <div className={styles.money_transition_item_left}>
                                    <FontAwesomeIcon
                                        icon={faCashRegister}
                                        className={styles.money_icon}
                                    />
                                    <div className={styles.money_transition_item_text}>コイン取得履歴</div>
                                </div>
                                <FontAwesomeIcon
                                    icon={faChevronRight}
                                    className={styles.money_icon}
                                />
                            </div>
                        </div>
                        <div className={styles.money_purchase}>
                            <div className={styles.money_purchase_head}>
                                <div className={styles.money_purchase_caution}>特定商取引法に基づく表記</div>
                                <ul className={styles.money_purchase_note}>
                                    <li>コインの購入にはクレジットカード（VISA、Mastercard、JCB、AMEX、Diners）がご利用いただけます。</li>
                                    <li>購入後のキャンセル等は一切できませんのでご注意ください。</li>
                                </ul>
                            </div>
                            {coinShowCase.map((coin: any) =>
                                <div className={styles.money_purchase_item}>
                                    <div className={styles.money_purchase_item_left}>
                                        <FontAwesomeIcon
                                            icon={faCoins}
                                            className={styles.money_purchase_coin_icon}
                                        />
                                        <div className={styles.money_purchase_item_left_block}>
                                            <div className={styles.money_value_text}>{coin.name}</div>
                                            <div className={styles.money_value_detail_text}>{coin.description}</div>
                                        </div>
                                    </div>
                                    <div className={styles.money_purchase_item_right}>
                                        <div className={styles.money_price_text}>{coin.price.toLocaleString('ja-JP', { style: 'currency', currency: 'JPY' })}</div>
                                        <FontAwesomeIcon
                                            icon={faChevronRight}
                                            className={styles.money_icon}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}