import styles from "./ClientError.module.css";
import Header from "../../components/Header/Header";
import { Link } from "react-router-dom";
const env = import.meta.env.VITE_ENV;
import {
  useRouteError,
  isRouteErrorResponse,
} from "react-router-dom";

function ClientError() {
  let error = useRouteError();
  if (env === "prod") {
    return (
      <main>
        <Header />
        <div className={styles["generic-error-container"]}>
          <h2>Unexpected Error</h2>
          <p>Couldn't load this page.</p>
          <Link to="/">Home</Link>
        </div>
      </main>
    );
  }

  if (isRouteErrorResponse(error)) {
    return (
      <div className={styles["error-container"]}>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div className={styles["error-container"]}>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre className={styles.stack}>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}

export default ClientError;
