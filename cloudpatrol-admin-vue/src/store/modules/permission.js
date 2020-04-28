import { constantRouterMap } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
		console.log(routes)
    state.addRoutes = routes
    //state.routes = constantRouterMap.concat(routes)
		state.routes = routes
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
		console.log(roles)
    return new Promise(resolve => {
      let accessedRoutes
			//accessedRoutes = constantRouterMap || []
      if (roles.includes('type:0')) {
        accessedRoutes = constantRouterMap || []
      } else {
        accessedRoutes = filterAsyncRoutes(constantRouterMap, roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
