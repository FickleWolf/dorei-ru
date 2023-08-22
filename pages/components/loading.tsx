import styles from "../../styles/Home.module.css";

export default function Loading() {
    return (
        <div className={styles.loading}>
            <div className={styles.spinner}></div>
        </div>
    );
}
