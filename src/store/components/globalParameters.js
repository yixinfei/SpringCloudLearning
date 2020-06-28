
//全局参数
const globalParam={
    state:{
        table:{
            maxHeight:620
        }
    },
    getters:{
        table:state=>{
            return state.table;
        }
    },
    mutations:{
        add_Table(state,param){
            state.table=param;
        }
    },
}
export default globalParam;