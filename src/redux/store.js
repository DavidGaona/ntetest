import { createStore, combineReducers} from 'redux'
import activarLogin from './reducers/activarLogin'
import authenticated from './reducers/authenticated'
import showInfo from './reducers/showInfo'
import showDirection from './reducers/showDirection'

const reducer = combineReducers({
    activarLogin,
    authenticated,
    showInfo,
    showDirection
});

const store = createStore(reducer);

export default store;