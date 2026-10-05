import styles from "./Game.module.css";
import Button from "../Button/Button";
import { useState, useEffect, useRef } from "react";
import Input from "../Input/Input";
import CharacterList from "../CharacterList/CharacterList";
import msToTime from "../../utils/msToTime";
import Modal from "../Modal/Modal";
import ActionModal from "../ActionModal/ActionModal";
const apiUrl = import.meta.env.VITE_API_URL;

function Game({ gameData, setGameStart, setGameData }) {
  const [timer, setTimer] = useState(0);
  const startTime = useRef(null);
  const [displayForm, setDisplayForm] = useState(false);
  const [displayModal, setDisplayModal] = useState(false);
  const [modalText, setModalText] = useState("");
  const [gameEnd, setGameEnd] = useState(false);
  const [foundCharacters, setFoundCharacters] = useState([]);
  const [missingCharacters, setMissingCharacters] = useState(
    gameData.characters,
  );
  const [boxMarkerDisplay, setBoxMarkerDisplay] = useState("hidden");
  const [submittingFind, setSubmittingFind] = useState(false);
  const [time, setTime] = useState();
  const [name, setName] = useState("");
  const [submittingScore, setSubmittingScore] = useState(false);
  const [submittingScoreError, setSubmittingScoreError] = useState(false);
  const [modalTimer, setModalTimer] = useState(0);
  const [xPos, setXPos] = useState(0);
  const [yPos, setYPos] = useState(0);
  const imgRef = useRef(null);

  function handleImgClick(e) {
    if (gameEnd) return;
    if (boxMarkerDisplay === "hidden") {
      const rect = imgRef.current.getBoundingClientRect();

      setBoxMarkerDisplay("visible");
      setXPos((e.clientX - rect.left) / rect.width); // 0 to 1
      setYPos((e.clientY - rect.top) / rect.height); // 0 to 1
      return;
    }

    setBoxMarkerDisplay("hidden");
  }

  async function handleSelectCharacter(character) {
    try {
      setSubmittingFind(true);
      const response = await fetch(`${apiUrl}/games/${gameData.gameId}/find`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ xPos, yPos, characterId: character.id }),
      });

      if (!response.ok) {
        if (response.status === 404) {
          const data = await response.json();
          setModal(`${character.name} is not here!`);
          return;
        }
        throw new Error("Server error");
      }

      const data = await response.json();

      const foundCharacter = data.character;
      foundCharacter.imgUrl = `${apiUrl}/${foundCharacter.imgUrl}`;
      setFoundCharacters((prev) => [...prev, foundCharacter]);
      setMissingCharacters(
        missingCharacters.filter((c) => c.id !== character.id),
      );

      if (data.gameWin) {
        setTime(data.time);
        setGameData({ ...gameData, token: data.token });
        handleWin();
        return;
      }

      setModal(`You found ${character.name}!`);
      setBoxMarkerDisplay("hidden");
    } catch (err) {
      setModal(err.message);
    } finally {
      setBoxMarkerDisplay("hidden");
      setSubmittingFind(false);
    }
  }

  function handleChange(e) {
    setName(e.target.value);
  }

  useEffect(() => {
    if (gameEnd) return;
    startTime.current = performance.now() - timer * 1000;
    let frame;

    const update = () => {
      const elapsed = (performance.now() - startTime.current) / 1000;
      setTimer(elapsed);
      frame = requestAnimationFrame(update);
    };

    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [gameEnd]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDisplayModal(false);
      setModalTimer(0);
    }, modalTimer);

    return () => clearTimeout(timeout);
  }, [modalTimer, modalText]);

  function handleWin() {
    setDisplayForm(true);
    setGameEnd(true);
  }

  function setModal(text) {
    setDisplayModal(true);
    setModalText(text);
    setModalTimer(5000);
  }

  async function handleSubmitScore(e) {
    e.preventDefault();
    const token = gameData.token;

    try {
      setSubmittingScore(true);

      const response = await fetch(`${apiUrl}/leaderboards`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(
            "Token expired! You must start a new game to upload your score.",
          );
        }
        throw new Error("Internal server error");
      }

      setGameStart(false);
    } catch (err) {
      setSubmittingScoreError(err);
    } finally {
      setSubmittingScore(false);
    }
  }

  return (
    <div className={styles.container}>
      <h1>{gameData.title}</h1>
      <div className={styles["missing-characters"]}>
        <h2>Characters in this level</h2>
        <CharacterList characters={gameData.characters} />
      </div>
      <span className={styles.time}>Time: {timer.toFixed(1)}s</span>
      <div className={styles["gameboard-container"]}>
        <div className={styles.gameboard}>
          <img
            ref={imgRef}
            className={styles["gameboard-img"]}
            onClick={handleImgClick}
            src={gameData.imgUrl}
          ></img>

          <div
            className={styles["target-box"]}
            style={{
              left: `${xPos * 100}%`,
              top: `${yPos * 100}%`,
              width: `${gameData.marker_size}%`,
              visibility: boxMarkerDisplay,
            }}
          ></div>

          <div
            className={styles["select-character"]}
            style={{
              left: `calc(${xPos * 100 + gameData.marker_size}%)`,
              top: `calc(${yPos * 100 - gameData.marker_size}%)`,
              visibility: boxMarkerDisplay,
            }}
          >
            {missingCharacters.map((character) => (
              <Button
                key={character.id}
                text={character.name}
                onClick={() => handleSelectCharacter(character)}
                disabled={submittingFind}
              />
            ))}
          </div>
        </div>
        <div className={styles["info-panel"]}>
          {gameEnd && (
            <div className={styles["win-alert"]}>
              <h2>You won!</h2>
              <span className={styles["btn-container"]}>
                <span className={styles["btn-wrapper"]}>
                  <Button
                    text="Submit score"
                    onClick={() => setDisplayForm(true)}
                  />
                </span>
                <span className={styles["btn-wrapper"]}>
                  <Button
                    text="Play again"
                    onClick={() => setGameStart(false)}
                  />
                </span>
              </span>
            </div>
          )}
        </div>
      </div>
      <div className={styles.characters}>
        <div className={styles["found-characters"]}>
          <h2>Found characters</h2>
          <CharacterList characters={foundCharacters} round={false} />
        </div>
      </div>
      <Modal shown={displayForm} close={() => setDisplayForm(false)}>
        <div className={styles["win-form"]}>
          <h2>Congrats! You won!</h2>
          <p>
            Time: <span>{msToTime(time)}</span>
          </p>
          <form onSubmit={handleSubmitScore}>
            <h3>Submit your time</h3>
            <Input text="Your name:" onChange={handleChange} value={name} />
            {submittingScoreError && <p>{submittingScoreError.message}</p>}
            <span className={styles["btn-container"]}>
              <span className={styles["btn-wrapper"]}>
                <Button
                  type="submit"
                  text="Submit"
                  disabled={submittingScore}
                />
              </span>
            </span>
          </form>
        </div>
      </Modal>
      <ActionModal
        text={modalText}
        shown={displayModal}
        close={() => setDisplayModal(false)}
      />
    </div>
  );
}

export default Game;
