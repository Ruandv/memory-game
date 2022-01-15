import { GameType } from '../GameType';
import { ITileSelection } from './ITileSelection';
import { IPlayer } from './Player';

export interface IGameItem {
    id: string;
    deviceUniqueId: string;
    gameName: string;
    gameType: GameType | undefined;
    players: IPlayer[];
    tiles: ITileSelection[];
    validTiles: ITileSelection[];
    completed: boolean;
}
