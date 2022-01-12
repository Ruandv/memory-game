import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./index.scss";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import History from "./components/History/history";
import { createStore } from "redux";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { GameType } from "./redux/GameType";
import { IGameItem } from "./redux/interfaces/GameItem";
import { IGameState } from "./redux/interfaces/NewGame";
import { IPlayer } from "./redux/interfaces/Player";
import rootReducer from "./redux/RootReducer";
import Game from "./components/Game/game";
import NotificationService from "./services/notificationService";
import StorageService from "./services/storageService";
import GeoLocationService from "./services/GeoLocationService";

let id = StorageService.getInstance().getValue("UniqueId", true);
id === null || id === "" ? (id = (crypto as any).randomUUID()) : (id = id);
StorageService.getInstance().save("UniqueId", id);

if ("geolocation" in navigator) {
  GeoLocationService.getInstance(id);
} else {
  console.log("GeoLocation is not supported");
}

let gameList = {} as IGameState;
//check if you have local storage data
let storageService = StorageService.getInstance();
let data = storageService.getValue("GameState", true);
if (data === null) {
  gameList = {
    history: [
      {
        id: (crypto as any).randomUUID(),
        gameName: "JamesFunny",
        gameType: GameType.Small,
        players: [
          {
            firstName: "Ruan",
            lastName: "de Villiers",
            ranking: 0,
          } as IPlayer,
        ],
        completed: true,
      } as IGameItem,
    ],
  };
  storageService.save("GameState", JSON.stringify(gameList));
  storageService.save("version", "1");
} else {
  gameList = JSON.parse(data) as IGameState;
}
let preloadedState = { gameList };
const getVersion = () => {
  let data = storageService.getValue("version", true);
  return data;
};
const store = createStore(rootReducer, preloadedState as any);
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <nav>
          <Link to="/">Home</Link> | <Link to="newGameForm">New Game</Link>
        </nav>
        <Routes>
          <Route path="/" element={<History />} />
          <Route path="/:latest" element={<History />} />
          <Route path="game/:gameId" element={<Game />} />
          <Route path="newGameForm" element={<Game />} />
        </Routes>
        <footer>{`Version : ${getVersion()} UniqueID: ${id}`}</footer>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

const conf = {
  onSuccess: (registration: ServiceWorkerRegistration) => {},
  onUpdate: (reg: ServiceWorkerRegistration) => {
    NotificationService.register(reg);
    let res = NotificationService.getInstance();
    if (res !== null) {
      reg.waiting!.postMessage({ type: "SKIP_WAITING" });
      (res as NotificationService).showMyNotification("T E S T 1 2 3");
    } else {
      console.error("NS IS NULL!!");
    }
  },
};

serviceWorkerRegistration.register(conf);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
