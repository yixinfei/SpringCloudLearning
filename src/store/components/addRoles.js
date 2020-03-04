
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
      console.log(index,req)
      const isHave =state.role.find(role => role.req === req && role.index ===index )
      console.log("呵呵",isHave)
      const ret = isHave ===undefined?true:false
      console.log(ret)
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


