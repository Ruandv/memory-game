import { useEffect, useState } from 'react';
import { IGameItem } from '../../interfaces/GameItem';
import FireBaseGameService from '../../services/FireBaseGameService';
import Styles from './history.module.scss';
import HistoryItem from './historyItem';
import StorageService from './../../services/storageService';

function History () {
  const [games, setGames] = useState({} as IGameItem[]);
  useEffect(() => {
    const service = StorageService.getInstance();
    const deviceUniqueId = service.getValue('UniqueId', true);
    FireBaseGameService.getAll(deviceUniqueId).then((data: IGameItem[]) => {
      setGames(data);
    });
  }, []);
  const loadList = () => {
    return games.map((x: IGameItem, i: number) => {
      return !x
        ? null
        : (
        <div>
          <HistoryItem key={i} {...{ data: x }} />
        </div>
          );
    });
  };
  return (
    <div className={Styles.gameHistory}>
      {games.length > 0 ? loadList() : 'Searching for games'}
    </div>
  );
}
export default History;
