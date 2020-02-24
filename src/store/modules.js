import addUser_store from './components/addUsers'
import addMenues_store from './components/addMenus.js'
import addRoutes_store from './components/addRoutes.js'
//import addPermission from './components/addPermission.js'
export default {
  menu: addUser_store,
  user: addMenues_store,
  route: addRoutes_store,
  //  permission:addPermission,
}
