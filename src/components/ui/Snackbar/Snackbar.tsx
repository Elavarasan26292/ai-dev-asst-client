import { useEffect } from "react";
import "./Snackbar.scss";

export interface SnackbarData {
  message: string;
  type: "success" | "error" | "info";
}

interface SnackbarProps {
  data: SnackbarData | null;
  onClose: () => void;
  duration?: number;
}

export default function Snackbar({
  data,
  onClose,
  duration = 4000,
}: SnackbarProps) {
  useEffect(() => {
    if (data) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [data, duration, onClose]);

  if (!data) return null;

  return (
    <div className={`snackbar snackbar--${data.type}`}>
      {data.message}
      <button className="snackbar__close" onClick={onClose}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}
