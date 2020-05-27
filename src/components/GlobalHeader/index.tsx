import React, { Component } from 'react'
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import { connect, Dispatch } from 'umi';
import { ConnectState } from '@/models/connect';
import styles from './index.less'
const logoImg = require('@/assets/logo.png')
interface CurrentUserProp {
  name: string;
  avatar?: string;
  userid: string;
  email?: string;
  address?: string;
  phone?: string;
  account: string;
}
interface useProp {
  status?: 'ok' | 'error';
  type?: string;
  currentUser?: object;
}
interface GlobalHeaderProps {
  dispatch?: any;
}
const GlobalHeader: React.FC<GlobalHeaderProps> = (props) => {
  const { dispatch } = props
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || JSON.stringify({}))
  // const currentUser = sessionStorage.getItem('currentUser') ? JSON.parse(sessionStorage.getItem('currentUser')) : {}
  const logout = () => {
    dispatch({
      type: 'login/logout',
      payload: {},
    })
  }
  return (
    <div className={styles.globalHeader}>
      <div className={styles.left}>
        <img src={logoImg} />
        <span className={styles.title}>后台管理系统</span>
      </div>
      <div className={styles.right}>
        <UserOutlined />
        <span className={styles.headUser}>{currentUser.userName}</span>
        <span className={styles.headExit} onClick={logout}>退出</span>
      </div>
    </div>
  )
}
export default connect(({ login }: ConnectState) => ({
  
}))(GlobalHeader);