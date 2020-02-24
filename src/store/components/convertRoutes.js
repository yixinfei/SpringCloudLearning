import { lazy } from './lazyLoading'
/**
 * 拼接动态路由
 */
export default (routerList, routeHideList, sysMenuList) => {
    toRoutes(routerList, routeHideList, sysMenuList)
}
function toRoutes(routerList, routeHideList, sysMenuList) {
    if (sysMenuList) {
        for (var i = 0; i < sysMenuList.length; i++) {
            var sysMenuNode = sysMenuList[i];
            var code = sysMenuNode.index;
            var routeNode = {
                name: code,
                path: '/' + code,
                component: lazy(code,sysMenuNode.title,sysMenuNode.vueSuperior),
                meta: { title: sysMenuNode.title },
                children: []
            };
            if (code && code != '') {
                if (sysMenuNode.isShow == '0') {
                    routeHideList.push(routeNode);
                }
                else {
                    routerList.push(routeNode);

                }
            }
        }
    }
}