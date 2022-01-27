import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./index.scss";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import History from "./components/History/history";
import reportWebVitals from "./reportWebVitals";
import Game from "./components/Game/game";
import StorageService from "./services/storageService";
import GeoLocationService from "./services/GeoLocationService";
let deviceUniqueId = StorageService.getInstance().getValue("UniqueId", true);

console.log("React Version: " + React.version);
deviceUniqueId =
  deviceUniqueId === null || deviceUniqueId === ""
    ? (crypto as any).randomUUID()
    : deviceUniqueId;
StorageService.getInstance().save("UniqueId", deviceUniqueId);
if ("geolocation" in navigator) {
  GeoLocationService.getInstance(deviceUniqueId);
} else {
  console.log("GeoLocation is not supported");
}

const getVersion = () => {
  return process.env.REACT_APP_VERSION;
};

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link> | <Link to="newGameForm">New Game</Link>
      </nav>
      <div className="content">
        <Routes>
          <Route path="/" element={<History />} />
          <Route path="/:latest" element={<History />} />
          <Route path="game/:gameId" element={<Game />} />
          <Route path="newGameForm" element={<Game />} />
        </Routes>
      </div>
      <footer>{`Version : ${getVersion()} UniqueID: ${deviceUniqueId}`}</footer>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

const conf = {
  onSuccess: (registration: ServiceWorkerRegistration) => {},
  onUpdate: (reg: ServiceWorkerRegistration) => {
    reg.waiting!.postMessage({ type: "SKIP_WAITING" });
    console.info("New version installed");
  },
};

serviceWorkerRegistration.register(conf);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
