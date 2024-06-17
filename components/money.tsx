import React, { useEffect, useState } from "react";
import styles from "../styles/Style.module.css";
import Image from "next/image";
import Loading from "./loading";
import { firestore } from "firebase-admin";
import { usePlatformSetting } from "../lib/provider/PlatformSettingProvider";
import { useAuth } from "../lib/provider/AuthProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faCoins, faCartShopping, faChevronRight, faCashRegister } from "@fortawesome/free-solid-svg-icons";


interface Coin {
    name: string;
    description: string;
    price: number;
    stripe_id: string;
}

interface Transaction {
    id: string;
    holder: string;
    createdAt: firestore.Timestamp;
    line_items: any;
    price: number;
    route: string;
    stripeTransaction: any;
    value: number
}

export default function Money({ closeMoney, closeMoneyFunc }: { closeMoney: boolean, closeMoneyFunc: () => void }) {
    const [coinShowCase, setCoinShowCase] = useState<Coin[]>([]);
    const { user, userData } = useAuth();
    const { platformSetting } = usePlatformSetting();
    const [isLoad, setIsLoad] = useState<boolean>(false);

    useEffect(() => {
        if (coinShowCase.length === 0) {
            setCoinShowCase(platformSetting.coinShowCase);
        }
    }, [platformSetting]);

    if (!userData) return null;
    if (isLoad) return <Loading />

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>, stripeId: string) => {
        setIsLoad(true);
        event.preventDefault();
        try {
            const res = await fetch(`/api/payment/checkoutSession?stripe_id=${stripeId}&userId=${user.uid}`, {
                method: 'POST',
            });
            if (res.ok) {
                const data = await res.json();
                const url = data.url;
                window.location.href = url;
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const PurchaseHistory = () => {
        if (userData.transactions.length == 0) return null;
        else {
            return (
                <div className={styles.money_history}>
                    <div className={styles.money_history_border} />
                    {userData.transactions.map((transaction: Transaction) => (
                        <div className={styles.money_history_item} key={transaction.id}>
                            <div className={styles.money_history_hero}>
                                <div className={styles.money_history_hero_sub}>TransactionID</div>
                                <div className={styles.money_history_hero_value}>{transaction.id}</div>
                            </div>
                            <div className={styles.money_history_hero}>
                                <div className={styles.money_history_hero_sub}>購入日時</div>
                                <div className={styles.money_history_hero_value}>{transaction.createdAt.toDate().toLocaleString()}</div>
                            </div>
                            <div className={styles.money_history_hero}>
                                <div className={styles.money_history_hero_sub}>有償・無償</div>
                                <div className={styles.money_history_hero_value}>{transaction.price != 0 ? "有償" : "無償"}</div>
                            </div>
                            <div className={styles.money_history_hero}>
                                <div className={styles.money_history_hero_sub}>購入金額</div>
                                <div className={styles.money_history_hero_value}>{transaction.price.toLocaleString('ja-JP', { style: 'currency', currency: 'JPY' })}</div>
                            </div>
                            <div className={styles.money_history_hero}>
                                <div className={styles.money_history_hero_sub}>取得コイン</div>
                                <div className={styles.money_history_hero_value}>{transaction.value} コイン</div>
                            </div>
                            <div className={styles.money_history_hero}>
                                <div className={styles.money_history_hero_sub}>取得経路</div>
                                <div className={styles.money_history_hero_value}>{transaction.route == "purchased" ? "購入" : "不明"}</div>
                            </div>
                            <div className={styles.money_history_hero}>
                                <div className={styles.money_history_hero_sub}>有効期限</div>
                                <div className={styles.money_history_hero_value}>-</div>
                            </div>
                            <div className={styles.money_history_hero}>
                                <div className={styles.money_history_hero_note}>この明細について問合せる</div>
                            </div>
                        </div>
                    ))}
                </div>
            )
        }
    };

    return (
        <div className={!closeMoney ? styles.money : styles.money_hidden}>
            <div className={styles.money_content}>
                <div
                    className={styles.money_close}
                    onClick={closeMoneyFunc}>
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
                            {coinShowCase.map((coin: Coin) => (
                                <form onSubmit={(e) => handleFormSubmit(e, coin.stripe_id)} key={`form_${coin.name}`} className={styles.money_purchase_item}>
                                    <button type="submit" role="link" className={styles.money_purchase_button}>
                                        <div className={styles.money_purchase_item_left}>
                                            <FontAwesomeIcon icon={faCoins} className={styles.money_purchase_coin_icon} />
                                            <div className={styles.money_purchase_item_left_block}>
                                                <div className={styles.money_value_text}>{coin.name}</div>
                                                <div className={styles.money_value_detail_text}>{coin.description}</div>
                                            </div>
                                        </div>
                                        <div className={styles.money_purchase_item_right}>
                                            <div className={styles.money_price_text}>
                                                {coin.price.toLocaleString('ja-JP', { style: 'currency', currency: 'JPY' })}
                                            </div>
                                            <FontAwesomeIcon icon={faChevronRight} className={styles.money_icon} />
                                        </div>
                                    </button>
                                </form>
                            ))}
                        </div>
                        <PurchaseHistory />
                    </div>
                </div>
            </div>
        </div>
    );
}
