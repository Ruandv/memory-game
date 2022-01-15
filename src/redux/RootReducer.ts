import gameListReducer from './reducers/GameHistoryReducer';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  // Define a top-level state field named `todos`, handled by `todosReducer`
  gameList: gameListReducer
  // filters: filtersReducer
});

export default rootReducer;
