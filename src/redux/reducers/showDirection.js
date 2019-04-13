import {type as showDirectionsAction} from '../actions/showDirectionsAction'
const defaultState = {show: false, data: [],toDelete: []};

function reducer(state = defaultState, {type, payload}){
    switch(type){
        case showDirectionsAction:
        
        if(payload.flag){
            
            return({
                show:true,
                data: payload.res,
                toDelete: payload.toDelete
            });
        }
        
        return {
            show:false,
            data: [],
            toDelete: []
        }

        default: 
            return state;
    }    
}

export default reducer;