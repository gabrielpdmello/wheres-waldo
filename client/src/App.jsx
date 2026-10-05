import styles from "./App.module.css";
import { Link } from "react-router";
import Button from "./components/Button/Button";
import { useEffect, useState } from "react";
import Loading from "./components/Loading/Loading";
const apiUrl = import.meta.env.VITE_API_URL;

function Gamecard({ id, title, img }) {
  return (
    <div className={styles.gamecard}>
      <h2>{title}</h2>
      <img src={`${apiUrl}/${img}`} />
      <Button type="link" to={`/levels/${id}`} text="Play!" />
    </div>
  );
}

function App() {
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${apiUrl}/levels`);
        if (!res.ok) {
          if (res.status === 404) {
            const err = new Error("Not Found");
            err.status = 404;
            throw err;
          }
          throw new Error("Server error");
        }
        const levels = await res.json();
        setLevels(levels);
      } catch (err) {
        if (err.status === 404) {
          navigate("/404", { replace: false });
        }
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <div className={styles["loading-wrapper"]}>
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles["error-msg"]}>
        <p>A network error was encountered</p>
      </div>
    );
  }

  if (levels.length === 0) {
    return (
      <div className={styles["error-msg"]}>
        <p>No levels found!</p>
      </div>
    );
  }

  return (
    <>
      <h1 className={styles.title}>Choose a game to play!</h1>
      <ol className={styles["game-list"]}>
        {levels.map((level) => (
          <li key={level.id}>
            <Gamecard id={level.id} title={level.title} img={level.imgUrl} />
          </li>
        ))}
      </ol>
    </>
  );
}

export default App;
