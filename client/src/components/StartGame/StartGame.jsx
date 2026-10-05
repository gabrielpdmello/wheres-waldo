import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./StartGame.module.css";
import Button from "../Button/Button";
import Game from "../Game/Game";
import Loading from "../Loading/Loading";
import msToTime from "../../utils/msToTime";
import CharacterList from "../CharacterList/CharacterList";
const apiUrl = import.meta.env.VITE_API_URL;

function GamePreview({ setGameStart, gameData, setGameData, loading, error }) {
  const [gameLoading, setGameLoading] = useState(false);
  async function startGame() {
    try {
      setGameLoading(true);
      const res = await fetch(`${apiUrl}/games`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ levelId: gameData.levelId }),
      });

      if (!res.ok) {
        throw new Error("Server error");
      }
      const data = await res.json();

      setGameData({ ...gameData, gameId: data.gameId });
      setGameStart(true);
    } catch (err) {
      console.log(err);
      if (err.status === 404) {
        alert("Level not found");
      }
    } finally {
      setGameLoading(false);
    }
  }

  if (loading) {
    return (
      <div className={styles["game-preview"]}>
        <h1>Loading Game...</h1>
        <div className={styles["loading-wrapper"]}>
          <Loading />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles["game-preview"]}>
        <h1>Error loading game</h1>
      </div>
    );
  }

  return (
    <div className={styles["game-preview"]}>
      <h1>{gameData.title}</h1>
      <p className={styles.description}>{gameData.description}</p>
      <div className={styles.characters}>
        <h2>Characters to find</h2>
        <CharacterList characters={gameData.characters} size="small" />
      </div>
      <img src={gameData.imgUrl} className={styles["level-img"]} />
      <h2 className={styles.ready}>Are you ready?</h2>
      <div className={styles["button-wrapper"]}>
        <Button text="Start game" onClick={startGame} disabled={gameLoading} />
      </div>
    </div>
  );
}

function Leaderboard({ data, loading, error }) {
  if (loading) {
    return (
      <div className={styles.leaderboard}>
        <h2>Leaderboard</h2>
        <div className={styles["loading-wrapper"]}>
          <Loading />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.leaderboard}>
        <h2>Leaderboard</h2>
        <p>Error loading leaderboard</p>
      </div>
    );
  }

  return (
    <div className={styles.leaderboard}>
      <h2>Leaderboard</h2>
      <table>
        <thead>
          <tr>
            <th>Position</th>
            <th>Name</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {data.map((score, index) => (
            <tr key={score.id}>
              <td>{index + 1}</td>
              <td>{score.name}</td>
              <td>{msToTime(score.time)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StartGame() {
  const { levelId } = useParams();
  // leaderboards
  const [leaderboard, setLeaderboard] = useState();
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  const [leaderboardError, setLeaderboardError] = useState(null);
  // level data
  const [gameData, setGameData] = useState({});
  const [levelLoading, setLevelLoading] = useState(true);
  const [levelError, setLevelError] = useState(null);
  // starting game
  const [gameStart, setGameStart] = useState(false);

  let navigate = useNavigate();

  useEffect(() => {
    async function loadLevel() {
      try {
        const res = await fetch(`${apiUrl}/levels/${levelId}`);
        if (!res.ok) {
          if (res.status === 404) {
            const err = new Error("Not Found");
            err.status = 404;
            throw err;
          }
          throw new Error("Server error");
        }
        const data = await res.json();

        const imgRes = await fetch(`${apiUrl}/${data.imgUrl}`);
        if (!imgRes.ok) {
          if (imgRes.status === 404) {
            const err = new Error("Not Found");
            err.status = 404;
            throw err;
          }
          throw new Error("Server error");
        }
        // Create blob from request and create a temporary URL to access it.
        // This loads the level image before starting the game
        const blob = await imgRes.blob();
        const blobUrl = URL.createObjectURL(blob);
        data.imgUrl = blobUrl;

        const charactersRes = await fetch(
          `${apiUrl}/levels/${levelId}/characters`,
        );

        const characters = await charactersRes.json();

        data.characters = [];
        for (const character of characters) {
          const characterImgRes = await fetch(`${apiUrl}/${character.imgUrl}`);
          if (!characterImgRes.ok) {
            if (characterImgRes.status === 404) {
              const err = new Error("Not Found");
              err.status = 404;
              throw err;
            }
            throw new Error("Server error");
          }
          const blobCharacter = await characterImgRes.blob();
          const blobCharacterUrl = URL.createObjectURL(blobCharacter);
          data.characters.push({
            id: character.id,
            name: character.name,
            imgUrl: blobCharacterUrl,
          });
        }

        data.levelId = levelId;

        setGameData(data);
      } catch (err) {
        if (err.status === 404) {
          navigate("/404");
        }
        setLevelError(err);
      } finally {
        setLevelLoading(false);
      }
    }

    loadLevel();

    return () => {
      // revoke URLs to free memory
      if (gameData) {
        URL.revokeObjectURL(gameData.imgUrl);
        gameData.characters?.forEach((character) => {
          URL.revokeObjectURL(character.imgUrl);
        });
      }
    };
  }, []);

  useEffect(() => {
    async function loadLeaderboard() {
      if (gameStart) return;

      try {
        const res = await fetch(`${apiUrl}/levels/${levelId}/leaderboard`);
        if (!res.ok) {
          if (res.status === 404) {
            const err = new Error("Not Found");
            err.status = 404;
            throw err;
          }
          throw new Error("Server error");
        }
        const data = await res.json();
        setLeaderboard(data);
      } catch (err) {
        if (err.status === 404) {
          console.log(err);
        }
        setLeaderboardError(err);
      } finally {
        setLeaderboardLoading(false);
      }
    }

    loadLeaderboard();
  }, [gameStart]);

  if (gameStart)
    return (
      <Game
        gameData={gameData}
        setGameData={setGameData}
        setGameStart={setGameStart}
      />
    );

  return (
    <div className={styles.container}>
      <GamePreview
        setGameStart={setGameStart}
        gameData={gameData}
        setGameData={setGameData}
        loading={levelLoading}
        error={levelError}
      />
      <Leaderboard
        data={leaderboard}
        loading={leaderboardLoading}
        error={leaderboardError}
      />
    </div>
  );
}

export default StartGame;
