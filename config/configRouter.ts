
export default [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/login',
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/BasicLayout',
    authority: ['admin', 'user'],
    routes: [
      {
        path: '/',
        redirect: '/user/login',
      },
      {
        path: '/home',
        name: 'home',
        component: './Welcome'
      },
      {
        path: '/userManagement',
        name: 'userManagement',
        component: './UserManagement/UserManagement'
      },
      {
        path: '/departmentManagement',
        name: 'departmentManagement',
        component: './DepartmentManagement/DepartmentManagement'
      },
      {
        component: './404',
      },
    ],
  },
  {
    component: './404',
  },
]