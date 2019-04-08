import { createStore, combineReducers} from 'redux'
import activarLogin from './reducers/activarLogin'
import authenticated from './reducers/authenticated'
import showInfo from './reducers/showInfo'
import showDirection from './reducers/showDirection'
import desdeDir from './reducers/desdeDir'
import hastaDir from './reducers/hastaDir'
import initialStateViajes from './reducers/initialStateViajes'
import activarCarInfo from './reducers/activarCarInfo'

const reducer = combineReducers({
    activarLogin,
    authenticated,
    showInfo,
    showDirection,
    desdeDir,
    hastaDir,
    initialStateViajes,
    activarCarInfo
});

const store = createStore(reducer);

export default store;