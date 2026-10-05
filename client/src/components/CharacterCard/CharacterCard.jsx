import styles from "./CharacterCard.module.css";

function CharacterCard({ name, imgUrl, round = true, size = "default" }) {
  return (
    <div className={styles["character-card"]}>
      <img className={`${round && styles.round} ${size === "small" ? styles.small : styles.default}`} src={imgUrl} />
      <h3>{name}</h3>
    </div>
  );
}

export default CharacterCard;
