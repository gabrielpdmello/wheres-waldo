import styles from "./Loading.module.css";
import loading from "../../assets/loading.svg?react";


function Loading() {
  return <img className={styles.loading} src={loading} alt="Loading" />;
}
export default Loading;
