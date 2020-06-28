import addUser_store from './components/addUsers'
import addMenues_store from './components/addMenus.js'
import addRoutes_store from './components/addRoutes.js'
import addRoles_store from './components/addRoles.js'
import globalParameters from './components/globalParameters.js'
export default {
  user: addUser_store,
  menu: addMenues_store,
  route: addRoutes_store,
  role: addRoles_store,
  param: globalParameters,
}
