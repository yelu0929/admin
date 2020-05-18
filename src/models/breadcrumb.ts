import { history, Reducer, Effect } from 'umi';
interface StateType {
  breadcrumb: Array<any>;
}
interface BreadcrumbModelType {
  namespace: string;
  state: StateType;
  effects?: {
    setData: Effect;
  };
  reducers: {
    setData: Reducer<StateType>;
  };
}

const BreadcrumbModel: BreadcrumbModelType = {
  namespace: 'breadcrumb',

  state: {
    breadcrumb: [],
  },
  // effects: {
  //   *setData({ payload }, { call, put }) {
  //     console.log('555555555555555555', payload)
  //     yield put({
  //       type: 'setBreadcrumbData',
  //       payload: payload,
  //     });
  //   },
  // },
  reducers: {
    setData(state, { payload }) {
      return {
        ...state,
        breadcrumb: payload
      };
    },
  },
};

export default BreadcrumbModel;