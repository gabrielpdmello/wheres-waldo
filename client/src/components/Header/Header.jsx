import styles from "./Header.module.css";
import { Link } from "react-router";

function Header() {
  return (
    <header className={styles.header}>
      <span className={styles.logo}>
        <Link to="/">Where's Waldo</Link>
      </span>
    </header>
  );
}

export default Header;
