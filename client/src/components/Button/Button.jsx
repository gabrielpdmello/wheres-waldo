import { Link } from "react-router";
import styles from "./Button.module.css";

function Button({
  text,
  to = "#",
  type = "button",
  variant = "default",
  onClick,
  disabled = false,
}) {


  if (type === "link") {
    return (
      <Link
        className={styles[`btn--${variant}`]}
        to={to}
      >
        {text}
      </Link>
    );
  }

  return (
    <button
      className={[styles[`btn--${variant}`], disabled && styles.loading].filter(Boolean).join(" ")}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
}

export default Button;
