import styles from "../styles/Style.module.css";

export default function Loading() {
    return (
        <div className={styles.loading}>
            <div className={styles.spinner}></div>
        </div>
    );
}
