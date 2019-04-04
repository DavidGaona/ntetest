import {type as showDirectionsAction} from '../actions/showDirectionsAction'
const defaultState = {show: false, data: []};

function reducer(state = defaultState, {type, payload}){
    switch(type){
        case showDirectionsAction:
        
        if(payload.flag){
            
            return({
                show:true,
                data: payload.res    
            });
        }
        
        return {
            show:false,
            data: []
        }

        default: 
            return state;
    }    
}

export default reducer;