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

let gameList = {} as IGameState;
//check if you have local storage data
var storageService = StorageService.getInstance();
var data = storageService.getValue("GameState",true);
if (data === null) {
  
  gameList = {
    history: [
      {
        id: 213,
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
    current: {
      id: 213,
      gameName: "CurrentGame",
      gameType: GameType.Small,
      players: [
        {
          firstName: "Current",
          lastName: "de Villiers",
          ranking: 0,
        } as IPlayer,
      ],
      completed: false,
    } as IGameItem,
  };
  storageService.save("GameState", JSON.stringify(gameList));
  storageService.save("version", "1");
} else {
  gameList = JSON.parse(data) as IGameState;
}
var preloadedState = { gameList };
const getVersion = () => {
  var data = storageService.getValue("version", true);
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
        <footer>{`Version : ${getVersion()}`}</footer>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

const conf = {
  onSuccess: (registration: ServiceWorkerRegistration) => {},
  onUpdate: (reg: ServiceWorkerRegistration) => {
    NotificationService.register(reg);
    var res = NotificationService.getInstance();
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
