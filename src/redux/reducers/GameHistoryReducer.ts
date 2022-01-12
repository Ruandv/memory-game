import { ActionType } from "../interfaces/ActionType";
import { ActionTypes } from "../ActionTypes";
import { IGameItem } from "../interfaces/GameItem";
import { ITileSelection } from "../interfaces/ITileSelection";
import { IGameState } from "../interfaces/NewGame";
import StorageService from "../../services/storageService";
import FireBaseDataService from "../../services/GameItemDataService";

// Use the initialState as a default value
export default function GameHistoryReducer(state: IGameState = {} as IGameState, action: ActionType) {
    let storageService = StorageService.getInstance();
    let deviceUniqueId = storageService.getValue("UniqueId", true);
    // The reducer normally looks at the action type field to decide what happens
    let result: any;
    let gameItem = action.payload as IGameItem;
    let idx = state.history.findIndex(x => x.id === gameItem.id);
    switch (action.type) {
        case ActionTypes.NextPlayer:
            state.history.splice(idx, 1);
            result = {
                ...state,
                history: [...state.history,
                    gameItem
                ] as IGameItem[]
            } as IGameState;
            break;
        case ActionTypes.SaveGame:
            state.history.splice(idx, 1);
            result = {
                ...state,
                history: [...state.history,
                    gameItem
                ] as IGameItem[]
            } as IGameState;
            break;
        case ActionTypes.NewGame:

            // We need to return a new state object
            result = {
                // that has all the existing state data
                ...state,
                // with all of the old todos
                history: [...state.history,
                // and the new todo object
                {
                    // Use an auto-incrementing numeric ID for this example
                    id: (crypto as any).randomUUID(),
                    deviceUniqueId,
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
    //storageService.save("GameState", JSON.stringify(result));
    FireBaseDataService.createSaveGameItem(gameItem, deviceUniqueId)
    return result;
}