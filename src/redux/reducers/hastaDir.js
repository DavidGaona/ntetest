import {type as updateHasta} from '../actions/updateHasta'
const defaultState = {dirHasta: {}};

function reducer(state = defaultState, {type, payload}){

    switch(type){
        case updateHasta:
        
        if(!payload){
            return state;
        }

        return {
            dirHasta: payload.dirHasta
        }

        default: 
            return state;
    }    
}

export default reducer;