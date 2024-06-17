import { useState } from 'react';
import styles from "../styles/Style.module.css";
import Image from "next/image";

export default function LineLoginButton() {
  const [authUrl, setAuthUrl] = useState(null);

  const handleLoginClick = async () => {
    try {
      const response = await fetch('/api/auth/getLineAuthUrl');
      const data = await response.json();
      setAuthUrl(data.url);
      window.location.href = data.url;
    } catch (error) {
      console.error('Failed to fetch LINE login URL:', error);
    }
  };

  return (
    <button onClick={handleLoginClick} className={styles.login_button}>
      <Image
        alt="line_icon_img"
        width={30}
        height={30}
        src={`https://ficklewolf.com/dorei-ru/image/LINE-icon.png`}
        className={styles.login_button_icon}
      />
      <div className={styles.login_button_text}>Login/SignUp With LINE</div>
    </button>
  );
}
