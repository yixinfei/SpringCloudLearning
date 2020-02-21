/**
 * 动态添加菜单
 * author:qlx
 */
const addMenus = {
    state: {
        menuList: []
    },
    getters: {
        menuList: state => {
            return state.menuList;
        }
    },
    mutations: {
        add_Menus(state, param) {
            if (param) {
                state.menuList = param;
            }
        }
    },
    actions: {
        add_Menus({ commit }, param) {
            commit('add_Menus', param)
        }
    }
}
export default addMenus