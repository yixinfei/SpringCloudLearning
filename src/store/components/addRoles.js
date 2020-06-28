
import { Message } from 'element-ui';

const addRole = {
  state: {
    role: {}
  },
  getters: {
    role: state => {
      return state.role;
    },
    getRole: (state) => (index,req) => {
      const isHave =state.role.find(role => role.req === req && role.index ===index )
      const ret = isHave ===undefined?true:false
      if(ret) Message.error("无相关权限")
      return ret
    }
  },
  mutations: {
    add_Roles(state, param) {
      state.role = param;
    }
  },
}
export default addRole;


