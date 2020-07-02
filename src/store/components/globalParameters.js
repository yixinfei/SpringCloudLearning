
//全局参数
const globalParam = {
    state: {
        table: {
            maxHeight: 620
        },
        unit: {
            id: "",
            systemName: "",
            loadingImage: "",
            navigationName: ""
        }
    },
    getters: {
        table: state => {
            return state.table;
        },
        unit: state => {
            return state.unit;
        },
    },
    mutations: {
        add_Table(state, param) {
            state.table = param;
        },
        add_Unit(state, param) {
            state.unit = param;
        }
    },
}
export default globalParam;