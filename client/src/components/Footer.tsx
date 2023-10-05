import styles from "./Footer.module.css";

const Footer = () => (
  <footer className={styles.footer}>
    Made with 💖 by the{" "}
    <a
      href="https://treasurebandit.me"
      target="_blank"
      rel="noreferrer"
      className={styles.footer__link}
    >
      treasurebandit
    </a>
  </footer>
);

export default Footer;
