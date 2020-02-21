const addUser={
    state:{
        user:{}
    },
    getters:{
        user:state=>{
            return state.user;
        }
    },
    mutations:{
        add_User(state,param){
            state.user=param;
        }
    },
}
export default addUser;