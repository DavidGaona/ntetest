import {type as initialStateViajes} from '../actions/initialStateViajes'
const defaultState = {sePidio: false, seConfirmo: false, calificar:false};

function reducer(state = defaultState, {type, payload}){

    switch(type){
        case initialStateViajes:
        
        if(!payload){
            return {
                payload: state
            };
        }

        return {
            payload
        }

        default: 
            return {
                payload: state
            };
    }    
}

export default reducer;