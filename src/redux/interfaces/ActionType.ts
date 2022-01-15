import { ActionTypes } from '../ActionTypes';

export interface ActionType {
    type: ActionTypes;
    payload: any;
}
