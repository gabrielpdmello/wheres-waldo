import styles from "./NotFound.module.css";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className={styles["container"]}>
      <h2>404</h2>
      <p>Not found.</p>
      <Link to="/">Home</Link>
    </div>
  );
}

export default NotFound;
