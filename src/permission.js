import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权

const whiteList = ['/login'] // 不重定向白名单
router.beforeEach( async(to, from, next) => {
  NProgress.start()
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger afterEach hook, so manually handle it
    } else {
			
      if (store.getters.roles.length === 0) {
			
        // store.dispatch('GetInfo').then(res => { // 拉取用户信息
        //   next()
        // }).catch((err) => {
        //   store.dispatch('FedLogOut').then(() => {
        //     Message.error(err || 'Verification failed, please login again')
        //     next({ path: '/' })
        //   })
        // })
          const { roles } = await store.dispatch('GetInfo')
					
          // generate accessible routes map based on roles
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
					console.log(accessRoutes)
          // dynamically add accessible routes
					
          //router.addRoutes(accessRoutes)

          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})
router.afterEach(() => {
  NProgress.done() // 结束Progress
})
//   // determine whether the user has logged in
//   const hasToken = getToken()

//   if (hasToken) {
//     if (to.path === '/login') {
//       // if is logged in, redirect to the home page
//       next({ path: '/' })
//       NProgress.done()
//     } else {
//       // determine whether the user has obtained his permission roles through getInfo
//       const hasRoles = store.getters.roles && store.getters.roles.length > 0
//       if (hasRoles) {
//         next()
//       } else {
//         try {
//           // get user info
//           // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
//           const { roles } = await store.dispatch('GetInfo')

//           // generate accessible routes map based on roles
//           const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

//           // dynamically add accessible routes
//           router.addRoutes(accessRoutes)

//           // hack method to ensure that addRoutes is complete
//           // set the replace: true, so the navigation will not leave a history record
//           next({ ...to, replace: true })
//         } catch (error) {
//           // remove token and go to login page to re-login
//           await store.dispatch('user/resetToken')
//           Message.error(error || 'Has Error')
//           next('/login')
//           NProgress.done()
//         }
//       }
//     }
//   } else {
//     /* has no token*/

//     if (whiteList.indexOf(to.path) !== -1) {
//       // in the free login whitelist, go directly
//       next()
//     } else {
//       // other pages that do not have permission to access are redirected to the login page.
//       next('/login')
//       NProgress.done()
//     }
//   }
// })

// router.afterEach(() => {
//   NProgress.done() // 结束Progress
// })
