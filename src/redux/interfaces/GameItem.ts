import { GameType } from "../GameType";
import { IPlayer } from "./Player";

export interface IGameItem {
    id: number;
    gameName: string;
    gameType: GameType;
    players: IPlayer[];
    tiles: ITileSelection[];
    validTiles: ITileSelection[];
    completed: boolean;
}

export interface ITileSelection {
    idx: number,
    val: string
}