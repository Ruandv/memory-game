import { ActionType } from "../interfaces/ActionType";
import { ActionTypes } from "../ActionTypes";
import { IGameItem, ITileSelection } from "../interfaces/GameItem";
import { IGameState } from "../interfaces/NewGame";
import StorageService from "../../services/storageService";

function nextId(gamelist: IGameItem[]) {
    const maxId = gamelist.reduce((maxId, history) => Math.max(history.id, maxId), -1)
    return maxId + 1
}
// Use the initialState as a default value
export default function GameHistoryReducer(state: IGameState = {} as IGameState, action: ActionType) {
    var storageService = StorageService.getInstance();
    // The reducer normally looks at the action type field to decide what happens
    var result: any;
    switch (action.type) {
        case ActionTypes.NextPlayer:
            var gameItem = action.payload as IGameItem;
            var idx = state.history.findIndex(x => x.id === gameItem.id);
            state.history.splice(idx, 1);
            result = {
                ...state,
                current: state.current,
                history: [...state.history,
                    gameItem
                ] as IGameItem[]
            } as IGameState;
            break;
        case ActionTypes.SaveGame:
            var gameItem = action.payload as IGameItem;
            var idx = state.history.findIndex(x => x.id === gameItem.id);
            state.history.splice(idx, 1);
            result = {
                ...state,
                current: state.current,
                history: [...state.history,
                    gameItem
                ] as IGameItem[]
            } as IGameState;
            break;
        case ActionTypes.NewGame:
            var gameItem = action.payload as IGameItem;
            // We need to return a new state object
            result = {
                // that has all the existing state data
                ...state,
                // but has a new array for the `todos` field
                current: state.current,
                // with all of the old todos
                history: [...state.history,
                // and the new todo object
                {
                    // Use an auto-incrementing numeric ID for this example
                    id: nextId(state.history),
                    players: gameItem.players,
                    completed: false,
                    gameType: gameItem.gameType,
                    gameName: gameItem.gameName,
                    tiles: gameItem.tiles,
                    validTiles: [] as ITileSelection[],
                } as IGameItem
                ] as IGameItem[]
            } as IGameState
            break;
        // Do something here based on the different types of actions
        default:
            // If this reducer doesn't recognize the action type, or doesn't
            // care about this specific action, return the existing state unchanged
            return state
    }
    storageService.save("GameState", JSON.stringify(result));
    return result;
}