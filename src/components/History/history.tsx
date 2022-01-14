import { useEffect, useState } from "react";
import { IGameItem } from "../../redux/interfaces/GameItem";
import FireBaseDataService from "../../services/GameItemDataService";
import Styles from "./history.module.scss";
import HistoryItem from "./historyItem";
import StorageService from "./../../services/storageService";

function History() {
  const [games, setGames] = useState({} as IGameItem[]);
  useEffect(() => {
    let service = StorageService.getInstance();
    const deviceUniqueId = service.getValue("UniqueId",true);
    FireBaseDataService.getAll(deviceUniqueId).then((data: IGameItem[]) => {
      setGames(data);
    });
  }, []);
  const loadList = () => {
    return games.map((x: IGameItem, i: number) => {
      return <HistoryItem key={i} {...{ data: x }} />;
    });
  };
  return (
    <div className={Styles.gameHistory}>
      {games.length > 0 ? loadList() : "Searching for games"}
    </div>
  );
}
export default History;
