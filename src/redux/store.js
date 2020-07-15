import logger from 'redux-logger';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './root-reducer';

const middlewares = [logger];

//we spread all the values/methods in the [logger] array in the method below
//hence the ...middlewares spread operator!
const store = createStore(rootReducer, applyMiddleware(...middlewares));

export default store;