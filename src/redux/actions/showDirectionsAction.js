export const type = 'showDirectionsAction';

const showDirectionsAction = (flag,res) => {
    if(flag){
        return( 
        {
            type,
            payload: {
                flag,
                res
                     }
        }); 
    }else{
        return {
            type,
            payload: {
                flag,
                res: {}    
            }    
        }    
    }
};

export default showDirectionsAction;