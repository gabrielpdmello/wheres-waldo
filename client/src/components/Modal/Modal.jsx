import styles from "./Modal.module.css";

function Modal({ children, shown, close }) {
  return shown ? (
    <div
      className={styles["modal-backdrop"]}
      onClick={() => {
        // close modal when outside of modal is clicked
        close();
      }}
    >
      <div
        className={styles["modal-content"]}
        onClick={(e) => {
          // do not close modal if anything inside modal content is clicked
          e.stopPropagation();
        }}
      >
        <button className={styles.close} onClick={close}>Close</button>
        {children}
      </div>
    </div>
  ) : null;
}

export default Modal