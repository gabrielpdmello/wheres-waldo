import styles from "./CharacterList.module.css"
import CharacterCard from "../CharacterCard/CharacterCard";

function CharacterList({ characters, size = "default", round = true }) {
  return (
    <div className={styles["characters-container"]}>
      {characters.map((character) => (
        <CharacterCard
          key={character.id}
          name={character.name}
          imgUrl={character.imgUrl}
          round={round}
          size={size}
        />
      ))}
    </div>
  );
}

export default CharacterList;
