import styles from "./ActionModal.module.css";

function ActionModal({ text, shown, close }) {
  return shown ? (
    <div className={styles["modal-content"]}>
      <p>{text}</p>
      <button className={styles.close} onClick={close}>
        Close
      </button>
    </div>
  ) : null;
}

export default ActionModal;
