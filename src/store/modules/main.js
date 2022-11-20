import Cookies from 'js-cookie'

const main = {
  state: {
    nowRouterPath: Cookies.get('nowRouterPath') ? Cookies.get('nowRouterPath') : '/',
    stat_pv: 0,
    loadingImgPath: []
  },
  mutations: {
    SET_NOW_ROUTER_PATH(state, nowRouterPath) {
      state.nowRouterPath = nowRouterPath
      Cookies.set('nowRouterPath', nowRouterPath)
    },
    SET_STAT_PV(state, pv_count) {
      state.stat_pv = pv_count
    },
    SET_LOADING_IMG_PATH(state, imgs) {
      state.loadingImgPath = imgs
    }
  },
  actions: {
    SetNowRouterPath({ commit }, nowRouterPath) {
      commit('SET_NOW_ROUTER_PATH', nowRouterPath)
    },
    setStatPv({ commit }, pv_count) {
      commit('SET_STAT_PV', pv_count)
    },
    setLoadingImgPath({ commit }, imgs) {
      commit('SET_LOADING_IMG_PATH', imgs)
    }
  }
}
export default main
