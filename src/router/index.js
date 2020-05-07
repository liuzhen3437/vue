import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'
import nestedRouter from './modules/nested'
/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
export const constantRouterMap = [
  {path: '/login', component: () => import('@/views/login/index'), hidden: true},
  {path: '/404', component: () => import('@/views/404'), hidden: true},
	{path: '/template',component: () => import('@/views/template'),hidden: true},
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'home',
      component: () => import('@/views/home/index'),
      meta: {title: '首页', icon: 'product-list'}
    }]
  },
  {
    path: '/setting',
    component: Layout,
    redirect: '/setting/company',
    name: 'setting',
    meta: {title: '基础设置', go:'false', icon: 'product-list'},
    children: [{
      path: 'company',
      name: 'company',
      component: () => import('@/views/setting/company/index'),
      meta: {title: '单位设置', icon: 'product-list',showRole:true},
      children:[{
        path: 'company/add',
        name: 'companyAdd',
        component: () => import('@/views/setting/company/add'),
        meta: {title: '添加单位', icon: 'product-list'},
        hidden: true
      },{
        path: 'company/update',
        name: 'companyUpdate',
        component: () => import('@/views/setting/company/update'),
        meta: {title: '修改单位', icon: 'product-list'},
        hidden: true
      }]
    },


    {
      path: 'address',
      name: 'address',
      component: () => import('@/views/setting/address/index'),
      meta: {title: '地点设置', icon: 'product-list',showRole:true},
			children:[
				{
				  path: 'LookCorrelation',
				  name: 'LookCorrelation',
				  component: () => import('@/views/setting/LookCorrelation/index'),
				  meta: {title: '查看关联事件', icon: 'product-list',showRole2:true},
				  hidden: true,
					children:[
						{
						  path: 'LookCorrelation/add',
						  name: 'LookCorrelationAdd',
						  component: () => import('@/views/setting/LookCorrelation/add'),
						  meta: {title: '添加关联事件', icon: 'product-list',showRole:false},
						  hidden: true
						},
					]
				},
        {
          path: 'address/update',
          name: 'addressUpdate',
          component: () => import('@/views/setting/address/update'),
          meta: {title: '修改地点', icon: 'product-list'},
          hidden: true
        },
        {
          path: 'address/add',
          name: 'addressAdd',
          component: () => import('@/views/setting/address/add'),
          meta: {title: '添加地点', icon: 'product-list'},
          hidden: true
        },
        {
          path: 'address/site',
          name: 'addressSite',
          component: () => import('@/views/setting/address/site'),
          meta: {title: '设置点坐标', icon: 'product-list'},
          hidden: true
        },
			]
    },



    {
      path: 'line',
      name: 'line',
      component: () => import('@/views/setting/line/index'),
      meta: {title: '线路设置', icon: 'product-list',showRole:true},
      children:[
        {
          path: 'line/add',
          name: 'lineAdd',
          component: () => import('@/views/setting/line/add'),
          meta: {title: '添加线路', icon: 'product-list'},
          hidden: true
        },
        {
          path: 'line/update',
          name: 'lineUpdate',
          component: () => import('@/views/setting/line/update'),
          meta: {title: '修改线路', icon: 'product-list'},
          hidden: true
        },
        {
          path: 'line/lineAddress',
          name: 'lineAddress',
          component: () => import('@/views/setting/line/lineAddress/index'),
          meta: {title: '线路地点设置', icon: 'product-list',showRole2:true},
          hidden: true,
          children:[
            {
              path: 'line/lineAddress/add',
              name: 'lineAddressAdd',
              component: () => import('@/views/setting/line/lineAddress/add'),
              meta: {title: '添加线路地点', icon: 'product-list'},
              hidden: true
            },
          ]
        },
      ]
    },




	{
	  path: 'staff',
	  name: 'staff',
	  component: () => import('@/views/setting/staff/index'),
	  meta: {title: '人员设置', icon: 'product-list',showRole:true},
    children:[
      {
        path: 'staff/update',
        name: 'staffUpdate',
        component: () => import('@/views/setting/staff/update'),
        meta: {title: '人员修改', icon: 'product-list'},
        hidden: true
      },
      {
        path: 'staff/add',
        name: 'staffAdd',
        component: () => import('@/views/setting/staff/add'),
        meta: {title: '添加人员', icon: 'product-list'},
        hidden: true
      },
    ]
	},


	{
	  path: 'incident',
	  name: 'incident',
	  component: () => import('@/views/setting/incident/index'),
	  meta: {title: '事件设置', icon: 'product-list',showRole:true},
    children:[
      {
        path: 'incident/update',
        name: 'incidentUpdate',
        component: () => import('@/views/setting/incident/update'),
        meta: {title: '事件修改', icon: 'product-list'},
        hidden: true
      },
      {
        path: 'incident/add',
        name: 'incidentAdd',
        component: () => import('@/views/setting/incident/add'),
        meta: {title: '添加事件', icon: 'product-list'},
        hidden: true
      },
    ]
	},

	{
	  path: 'equipment',
	  name: 'equipment',
	  component: () => import('@/views/setting/equipment/index'),
	  meta: {title: '设备管理', icon: 'product-list',showRole:true},
    children:[
      {
        path: 'equipment/update',
        name: 'equipmentUpdate',
        component: () => import('@/views/setting/equipment/update'),
        meta: {title: '设备修改', icon: 'product-list'},
        hidden: true
      },
      {
        path: 'equipment/add',
        name: 'equipmentAdd',
        component: () => import('@/views/setting/equipment/add'),
        meta: {title: '添加设备', icon: 'product-list'},
        hidden: true
      },
    ]
	},

	// {
	//   path: 'LookCorrelation',
	//   name: 'LookCorrelation',
	//   component: () => import('@/views/setting/LookCorrelation/index'),
	//   meta: {title: '查看关联事件', icon: 'product-list'},
	//   hidden: true
	// },

	{
	  path: 'PlanSetUp',
	  name: 'PlanSetUp',
	  component: () => import('@/views/setting/PlanSetUp/index'),
	  meta: {title: '计划设置',showRole:true, icon: 'product-list'},
		children: [
			{
			  path: 'PlanSetUp/add',
			  name: 'PlanSetUpAdd',
			  component: () => import('@/views/setting/PlanSetUp/add'),
			  meta: {title: '添加计划', icon: 'product-list'},
			  hidden: true
			},
      {
        path: 'PlanSetUp/update',
        name: 'PlanSetUpUpdate',
        component: () => import('@/views/setting/PlanSetUp/update'),
        meta: {title: '修改计划', icon: 'product-list'},
        hidden: true
      },
      {
        path: 'PlanSetUp/PlanPointSetting',
        name: 'PlanPointSetting',
        component: () => import('@/views/setting/PlanSetUp/PlanPointSetting/index'),
        meta: {title: '计划点设置', icon: 'product-list',showRole2:true},
        hidden: true,
        children:[
          {
            path: 'PlanSetUp/PlanPointSetting/update',
            name: 'PlanPointSettingUpdate',
            component: () => import('@/views/setting/PlanSetUp/PlanPointSetting/update'),
            meta: {title: '计划点编辑', icon: 'product-list'},
            hidden: true
          },
        ]
      },
      {
        path: 'PlanSetUp/associatedApparatus',
        name: 'associatedApparatus',
        component: () => import('@/views/setting/PlanSetUp/associatedApparatus/index'),
        meta: {title: '计划关联设备', icon: 'product-list',showRole2:true},
        hidden: true,
        children:[
          {
            path: 'PlanSetUp/associatedApparatus/add',
            name: 'associatedApparatusAdd',
            component: () => import('@/views/setting/PlanSetUp/associatedApparatus/add'),
            meta: {title: '添加计划关联设备', icon: 'product-list'},
            hidden: true
          },
        ]
      },
      {
        path: 'PlanSetUp/AssociatedPersonnel',
        name: 'AssociatedPersonnel',
        component: () => import('@/views/setting/PlanSetUp/AssociatedPersonnel/index'),
        meta: {title: '计划关联巡检员设置', icon: 'product-list',showRole2:true},
        hidden: true,
        children:[
          {
            path: 'PlanSetUp/AssociatedPersonnel/add',
            name: 'AssociatedPersonnelAdd',
            component: () => import('@/views/setting/PlanSetUp/AssociatedPersonnel/add'),
            meta: {title: '添加计划关联巡检员设置', icon: 'product-list'},
            hidden: true
          }
        ]
      },
		]
	},
	// {
	//   path: 'PlanSetUp/add',
	//   name: 'PlanSetUpAdd',
	//   component: () => import('@/views/setting/PlanSetUp/add'),
	//   meta: {title: '添加计划', icon: 'product-list'},
	//   hidden: true
	// },







  ]
  },
  {
    path: '/data',
    component: Layout,
    redirect: '/data/inspectionRecords',
    name: 'data',
    meta: {title: '报表数据',go:'false', icon: 'product-list'},
    children: [{
      path: 'inspectionRecords',
      name: 'inspectionRecords',
      component: () => import('@/views/reportData/inspectionRecords/index'),
      meta: {title: '计划考核', icon: 'product-list'}
    },{
      path: 'comparison',
      name: 'comparison',
      component: () => import('@/views/reportData/comparison/index'),
      meta: {title: '对比分析', icon: 'product-list'}
    },{
      path: 'CloudTour',
      name: 'CloudTour',
      component: () => import('@/views/reportData/CloudTour/index'),
      meta: {title: '巡检记录', icon: 'product-list'}
    },{
      path: 'CloudTour/LookIncident',
      name: 'CloudTourList',
      component: () => import('@/views/reportData/CloudTour/LookIncident'),
      meta: {title: '查看事件', icon: 'product-list'},
      hidden: true
    },{
      path: 'CloudTour/attachment',
      name: 'CloudTourAttachment',
      component: () => import('@/views/reportData/CloudTour/attachment'),
      meta: {title: '查看附件', icon: 'product-list'},
      hidden: true
    },{
      path: 'report',
      name: 'report',
      component: () => import('@/views/reportData/monthlyCalendar/index'),
      meta: {title: '月历报表', icon: 'product-list'}
    },{
      path: 'reportLine',
      name: 'reportLine',
      component: () => import('@/views/reportData/monthlyCalendar/line'),
      meta: {title: '月历报表-路线', icon: 'product-list'},
	    hidden: true
    },
    {
      path: 'IncidentReport',
      name: 'IncidentReport',
      component: () => import('@/views/reportData/IncidentReport/index'),
      meta: {title: '事件报表', icon: 'product-list'}
    },{
      path: 'historicalRoute',
      name: 'historicalRoute',
      component: () => import('@/views/reportData/historicalRoute/index'),
      meta: {title: '历史轨迹', icon: 'product-list'}
    },{
      path: 'monitoring',
      name: 'monitoring',
      component: () => import('@/views/reportData/monitoring/index'),
      meta: {title: '实时监控', icon: 'product-list'}
    }]
    // {
    //   path: 'oplog',
    //   name: 'oplog',
    //   component: () => import('@/views/reportData/oplog/index'),
    //   meta: {title: '操作日志', icon: 'product-list'}
    // }]
  },{
    path: '/inform',
    component: Layout,
    redirect: '/inform/inquire',
    name: 'inform',
    meta: {title: '通知管理',go:'false', icon: 'product-list'},
    children: [{
      path: 'inquire',
      name: 'inquire',
      component: () => import('@/views/inform/inquire/index'),
      meta: {title: '查询通知', icon: 'product-list'}
    },{
      path: 'publish',
      name: '/inform/publish',
      component: () => import('@/views/inform/publish/index'),
      meta: {title: '发布通知', icon: 'product-list',showRole:true},
      children:[
        {
          path: 'publish/add',
          name: 'publishAdd',
          component: () => import('@/views/inform/publish/add'),
          meta: {title: '添加通知', icon: 'product-list'},
          hidden: true
        },{
          path: 'publish/update',
          name: 'publishUpdate',
          component: () => import('@/views/inform/publish/update'),
          meta: {title: '修改通知', icon: 'product-list'},
          hidden: true
        }
      ]
    }]
  },
  {
    path: '/account',
    component: Layout,
    redirect: '/account/manage',
    name: 'account',
    meta: {title: '用户管理',go:'false', icon: 'product-list'},
    children: [{
      path: 'manage',
      name: 'manage',
      component: () => import('@/views/account/manage/index'),
      meta: {title: '账户管理', icon: 'product-list',showRole:true},
      children:[
        {
          path: 'manage/add',
          name: 'manageAdd',
          component: () => import('@/views/account/manage/add'),
          meta: {title: '添加账户', icon: 'product-list'},
          hidden: true
        },{
          path: 'manage/update',
          name: 'manageUpdate',
          component: () => import('@/views/account/manage/update'),
          meta: {title: '修改账户', icon: 'product-list'},
          hidden: true
        }
      ]
    }]
  },{
    path: '/Contact',
    component: Layout,
    name: 'Contact',
    redirect: '/Contact',
    meta: {title: '联系人管理',go:'false', icon: 'product-list'},
    children: [{
      path: 'ContactName',
      name: 'ContactName',
      component: () => import('@/views/Contact/index'),
      meta: {title: '查看联系人', icon: 'product-list',showRole:true},
      children:[
        {
          path: 'ContactName/add',
          name: 'ContactAdd',
          component: () => import('@/views/Contact/add'),
          meta: {title: '添加联系人', icon: 'product-list'},
          hidden: true
        },{
          path: 'ContactName/update',
          name: 'ContactUpdate',
          component: () => import('@/views/Contact/update'),
          meta: {title: '修改联系人', icon: 'product-list'},
          hidden: true
        }
      ]
    }]
  },

  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/home',
  //   children: [{
  //     path: 'home',
  //     name: 'home',
  //     component: () => import('@/views/home/index'),
  //     meta: {title: '首页', icon: 'product-list'}
  //   }]
  // },
// nestedRouter,
  {path: '*', redirect: '/404', hidden: true}
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})
