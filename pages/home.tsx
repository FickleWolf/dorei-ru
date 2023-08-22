import styles from "../styles/Home.module.css";
import Loading from "../pages/components/loading";
import font from "../lib/font";
import Header from "../pages/components/header";
import Footer from "../pages/components/footer";

export default function HomePage() {
    const { rocknRoll_One } = font();

    return (
        <div className={`${styles.body} ${rocknRoll_One.className}`}>
            <Header />
            <div className={styles.container}>
                <div className={styles.wrapper}>
                    <div className={styles.section_eyecatch}>

                    </div>
                    <div className={styles.section_hero}>
                        <div className={styles.hero_category}>
                            <div className={styles.hero_category_tittle}>

                            </div>
                            <div className={styles.hero_category_items}>
                                <div className={styles.category_item}>
                                    <div className={styles.category_item_inner}>
                                        <div className={styles.category_item_icon}>

                                        </div>
                                        <div className={styles.category_item_text}>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.section_img}>

                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
}
