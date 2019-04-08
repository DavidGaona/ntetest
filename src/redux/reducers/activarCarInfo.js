import {type as showCarInfo} from '../actions/showCarInfo'
const defaultState = false;

function reducer(state = defaultState, {type, payload}){
    switch(type){
        case showCarInfo:
        if(!payload){
            return false;    
        }
        
        return payload;

        default: 
            return false;
    }   
}

export default reducer;