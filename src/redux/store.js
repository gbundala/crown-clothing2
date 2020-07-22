import logger from 'redux-logger';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './root-reducer';
import { persistStore } from 'redux-persist';

const middlewares = [];

if (process.env.NODE_ENV === 'development') {
    middlewares.push(logger);
}

//we spread all the values/methods in the [logger] array in the method below
//hence the ...middlewares spread operator!
export const store = createStore(rootReducer, applyMiddleware(...middlewares));

export const persistor = persistStore(store);

export default { store, persistor };
