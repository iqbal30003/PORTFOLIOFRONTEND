import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5103";

function ApiStatus() {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/health`)
      .then(() => setStatus("online"))
      .catch(() => setStatus("offline"));
  }, []);

  let color;
  let text;

  switch (status) {
    case "online":
      color = "green";
      text = "API Online";
      break;
    case "offline":
      color = "red";
      text = "API Offline";
      break;
    default:
      color = "gray";
      text = "Checking API...";
  }

  return (
    <div style={{ marginBottom: "1rem", fontWeight: "bold", color }}>
      ● {text}
    </div>
  );
}

export default ApiStatus;
