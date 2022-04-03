import { createStore, combineReducers } from "redux";
import { composeWithDevTools } from 'redux-devtools-extension';

import bookReducer from "../reducer/bookReducer";

const rootReducer = combineReducers({
    books: bookReducer,
})
const store = createStore(rootReducer, composeWithDevTools());

export default store;