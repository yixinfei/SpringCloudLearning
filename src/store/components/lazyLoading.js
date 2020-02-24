/**
 * 
 * 懒加载动态路由 
 */
function lazy(code,title,vueSuperior) {

  //return  resolve => require(["@/components/" + name + ".vue"], resolve)
  return getComponetByPath(code,title,vueSuperior);


}
function getComponetByPath(code,title,vueSuperior) {
  const path = '/'+code;
  let dynamicRouter ={
    name: code,
    path: path,
    component: () => import('@/components/'+vueSuperior+path),
    meta: {
      title: title
    }
  }
    return  dynamicRouter.component
}
export { lazy }

