/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import { BasicLayoutProps as ProLayoutProps, } from '@ant-design/pro-layout';
import React, { useState, useEffect, ReactNode } from 'react';
import { Link } from 'umi';
import { Layout, Menu, Breadcrumb } from 'antd';
import Authorized from '@/utils/Authorized';
import GlobalHeader from '@/components/GlobalHeader'
import styles from './basicLayout.less'
import menuName from '@/locales/zh-CN/menu'
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
// const fontJs = require('../assets/iconfont.js');

// const IconFont = Icon.createFromIconfontCN({
//   scriptUrl: fontJs,
// });
export interface BasicLayoutProps extends ProLayoutProps {
  route: ProLayoutProps['route'] & {
    authority: string[];
  };
}
interface routesItem {
  path: string;
  routes?: Array<routesItem>;
  name: string;
  component: string;
  authority?: Array<any>;
  icon?: string;
  children?: Array<any>;
  exact?: boolean;
  redirect?: string;
}
const BasicLayout: React.FC<BasicLayoutProps> = (props) => {
  const { children, route: { routes }, navTheme = 'dark' } = props
  const getNode = (data: Array<any>, key: string) => {
    let node = null
    const filter = (treeData: Array<any>) => {
      treeData.map(item => {
        if (item.path === key) {
          node = [item]
        } else {
          if (item.children) {
            filter(item.children)
          }
        }
      })
    }
    filter(data)
    return node
  }
  const getParent = (data: Array<any>, key: string) => {
    let parentNode = null
    const filter = (treeData: Array<any>) => {
      treeData.map(item => {
        if (item.children) {
          if (item.children.some((val: routesItem) => val.path === key)) {
            parentNode = item
          } else {
            filter(item.children)
          }
        }
      })
    }
    filter(data)
    return parentNode
  }
  let breadcrumbData = getNode(routes || [], location.pathname) || []
  let parentNode = getParent(routes || [], location.pathname)
  while (parentNode) {
    breadcrumbData.unshift(parentNode)
    parentNode = getParent(routes || [], parentNode.path)
  }
  const getMenu = (routes: Array<any>) => {
    // routes.map(subMenu => {
    //   if (subMenu.children && subMenu.children.some(child => child.name)) {
    //     return (
    //       <SubMenu key={subMenu.path} icon={<UserOutlined />} title={subMenu.name}>
    //         {getMenu(subMenu.children)}
    //       </SubMenu>
    //     )
    //   } else {
    //     return <Menu.Item key={subMenu.path}>{subMenu.name}</Menu.Item>
    //   }
    // })
    if (!routes) {
      return [];
    }
    return routes
      .filter(item => item.name && !item.hideInMenu)
      .map(item => getSubMenu(item))
      .filter(item => item);
  }
  const getSubMenu = (item: routesItem) => {
    if (item.children && item.children.some(child => child.name)) {
      const { name } = item;
      return (
        <SubMenu
          title={menuName[`menu.${name}`] || name}
          key={item.path}
        // icon={getIcon(item.icon)}
        >
          {getMenu(item.children)}
        </SubMenu>
      );
    }
    return <Menu.Item key={item.path}>{getMenuItemPath(item)}</Menu.Item>;
  }
  const getIcon = (icon) => {
    // if (typeof icon === 'string') {
    //   return <IconFont type={icon} />;
    // }
    // return icon;
  }
  const getMenuItemPath = (item: routesItem, type = 2) => {
    // const icon = getIcon(item.icon);
    return (
      <Link
        to={item.path}
        replace={item.path === location.pathname}
      >
        {/* {icon} */}
        {/* {type === 2 && item.icon ? <img src={item.icon} /> : null} */}
        <span>{menuName[`menu.${item.name}`] || item.name}</span>
      </Link>
    );
  }
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className={styles.header}>
        {/* <div className="logo" /> */}
        {/* <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
        <Menu.Item key="1">nav 1</Menu.Item>
        <Menu.Item key="2">nav 2</Menu.Item>
        <Menu.Item key="3">nav 3</Menu.Item>
      </Menu> */}
        <GlobalHeader />
      </Header>
      <Layout>
        <Sider width={200} className={styles.menuLeft}>
          <Menu
            mode="inline"
            theme={navTheme}
            defaultSelectedKeys={[location.pathname]}
            // defaultOpenKeys={['sub1']}
            style={{ height: '100%', borderRight: 0 }}
          >
            {getMenu(routes || [])}
          </Menu>
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            {breadcrumbData && breadcrumbData.map((item: routesItem) => {
              return <Breadcrumb.Item key={item.path}>{getMenuItemPath(item, 1)}</Breadcrumb.Item>
            })}
          </Breadcrumb>
          <Content
            className="site-layout-background"
            style={{
              padding: 0,
              margin: 0,
              minHeight: 280,
              minWidth: 1000,
              overflowX: 'auto',
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}

export default BasicLayout
