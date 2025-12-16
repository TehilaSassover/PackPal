'use client';
import styles from "../styles/Home.module.css";
export default function Home() {
  return (
    <div className={styles.container}>
      <img src="/images/hero.webp" alt="background" className={styles.bgImage} />
      <h1 className={styles.text}>Think less, pack better.</h1>
    </div>
  );
}
