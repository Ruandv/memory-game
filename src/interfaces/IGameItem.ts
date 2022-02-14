import { GameType } from '../enums/GameType';
import { ITileSelection } from './ITileSelection';
import { IPlayer } from './IPlayer';

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