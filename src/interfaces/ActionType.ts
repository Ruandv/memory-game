import { ActionTypes } from '../enums/ActionTypes';

export interface ActionType {
    type: ActionTypes;
    payload: any;
}
