import React, { Component } from 'react'
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import { connect, Dispatch } from 'umi';
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
  currentUser: CurrentUserProp
}
interface GlobalHeaderProps {
  currentUser: CurrentUserProp;
  dispatch?: any;
}
const GlobalHeader: React.FC<GlobalHeaderProps> = (props) => {
  console.log('99999999999999999999', props)
  const { currentUser, dispatch } = props
  const logout = () => {
    dispatch({
      type: 'login/logout',
      payload: {userName: currentUser.account},
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
        <span className={styles.headUser}>{currentUser.name}</span>
        <span className={styles.headExit} onClick={logout}>退出</span>
      </div>
    </div>
  )
}
export default connect(({ user }: {user: useProp}) => ({
  currentUser: user.currentUser,
}))(GlobalHeader);