import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { IGameItem } from "../../redux/interfaces/GameItem";
import { IGameState } from "../../redux/interfaces/NewGame";
import Styles from "./history.module.scss";
import HistoryItem from "./historyItem";

function History() {
  const [gameState, SetGameState] = useState({} as IGameState);
  const state = useSelector((x: any) => {
    return x.gameList as IGameState;
  });
  useEffect(() => {
    SetGameState(state);
    //closeModal();
  }, [state]);

  return (
    <div className={Styles.gameHistory}>
      {gameState?.history?.map((x: IGameItem,i:number) => {
        return <HistoryItem key={i} {...{ data: x }} />;
      })}
    </div>
  );
}
export default History;
