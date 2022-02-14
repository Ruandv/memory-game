import Styles from './historyItem.module.scss';
import { useNavigate } from 'react-router-dom';
import { IGameItem } from '../../interfaces/IGameItem';

export interface IHistoryItemProps {
  data: IGameItem;
}
function HistoryItem (props: any) {
  const { data }: IHistoryItemProps = props;
  const navigate = useNavigate();
  if (data === undefined) {
    return null;
  }
  return (
    <div
      onClick={() => {
        navigate(`/game/${data.id}`);
      }}
      className={Styles.card}
      key={data.id}
    >
      <header>{`${data.gameName} ${data.id}`}</header>
      <div className={Styles.content}>
        <p>Game Type: {data.gameType}</p>
        <p>Players: {data.players.length}</p>
        <p>Game Completed: {data.completed.toString()}</p>
      </div>
      <footer>
        <div className={'btn'} hidden={data.completed === true}>
          Continue
        </div>
      </footer>
    </div>
  );
}

export default HistoryItem;
