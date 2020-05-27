import { stringify } from 'querystring';
import { history, Reducer, Effect } from 'umi';

import { fakeAccountLogin,fakeAccountLogout } from '@/services/login';
import { setAuthority } from '@/utils/authority';

export interface StateType {
  status?: 'ok' | 'error';
  type?: string;
}

export interface LoginModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    logout: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
  };
}

const Model: LoginModelType = {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (response.status === 'ok') {
        sessionStorage.setItem('currentUser', JSON.stringify(response.data[0]))
        history.push('/home');
      }
    },

    *logout({payload}, { call }) {
      // const { redirect } = getPageQuery();
      // // Note: There may be security issues, please note
      // if (window.location.pathname !== '/user/login' && !redirect) {
      //   history.replace({
      //     pathname: '/user/login',
      //     search: stringify({
      //       redirect: window.location.href,
      //     }),
      //   });
      // }
      const response = yield call(fakeAccountLogout, payload);
      if (response.status === 'ok') {
        history.push('/user/login')
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      return {
        ...state,
        status: payload.status,
        // type: payload.type,
      };
    },
  },
};

export default Model;
