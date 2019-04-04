import {type as updateDesde} from '../actions/updateDesde'
const defaultState = {dirOrigen: {}};

function reducer(state = defaultState, {type, payload}){
    switch(type){
        case updateDesde:
        if(!payload){
            return state;
        }

        return {
            dirOrigen: payload.dirOrigen
        }

        default: 
            return state;
    }    
}

export default reducer;