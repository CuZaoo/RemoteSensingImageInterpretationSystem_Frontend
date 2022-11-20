import Vue from 'vue'

const img = {
  state: {
    mbtq_img_list: [],
    bhjc_img_list: [],
    mbjc_img_list: [],
    dwjc_img_list: [],
    mbtq_img_list_result: [],
    bhjc_img_list_result: [],
    mbjc_img_list_result: [],
    dwjc_img_list_result: [],
    mbtq_all_run: false,
    mbjc_all_run: false,
    bhjc_all_run: false,
    dwjc_all_run: false
  },
  mutations: {
    SET_MBTQ_ALL_RUN(state) {
      state.mbtq_all_run = !state.mbtq_all_run
    },
    SET_MBJC_ALL_RUN(state) {
      state.mbjc_all_run = !state.mbjc_all_run
    },
    SET_BHJC_ALL_RUN(state) {
      state.bhjc_all_run = !state.bhjc_all_run
    },
    SET_DWJC_ALL_RUN(state) {
      state.dwjc_all_run = !state.dwjc_all_run
    },
    SET_IMG_TO_MBTQ: (state, img) => {
      state.mbtq_img_list.push(img)
      console.log('mbtq')
      console.log(state.mbtq_img_list)
    },
    SET_IMG_TO_BHJC: (state, img) => {
      let map = new Object()
      console.log('img')
      console.log(img)
      Vue.set(map, 'img1', img)
      state.bhjc_img_list.push(map)
    },
    SET_IMG_TO_BHJC2: (state, obj) => {
      let map = state.bhjc_img_list[obj.index]
      Vue.set(map, 'img2', obj.img)
    },
    SET_IMG_TO_MBJC: (state, img) => {
      state.mbjc_img_list.push(img)
    },
    SET_IMG_TO_DWJC: (state, img) => {
      state.dwjc_img_list.push(img)
    },
    SET_IMG_TO_MBTQ_RESULT: (state, img) => {
      state.mbtq_img_list_result = []
      state.mbtq_img_list_result.push(img)
    },
    SET_IMG_TO_MBTQ_RESULT_ALL: (state, arr) => {
      Vue.set(state, 'mbtq_img_list_result', [])
      state.mbtq_img_list_result = arr
    },
    SET_IMG_TO_BHJC_RESULT: (state, img) => {
      state.bhjc_img_list_result.push(img)
    },
    SET_IMG_TO_BHJC_RESULT_ALL: (state, arr) => {
      Vue.set(state, 'bhjc_img_list_result', [])
      state.bhjc_img_list_result = arr
    },
    SET_IMG_TO_MBJC_RESULT: (state, img) => {
      state.mbjc_img_list_result.push(img)
    },
    SET_IMG_TO_MBJC_RESULT_ALL: (state, arr) => {
      Vue.set(state, 'mbjc_img_list_result', [])
      state.mbjc_img_list_result = arr
    },
    SET_IMG_TO_DWJC_RESULT: (state, img) => {
      state.dwjc_img_list_result.push(img)
    },
    SET_IMG_TO_DWJC_RESULT_ALL: (state, arr) => {
      Vue.set(state, 'dwjc_img_list_result', [])
      state.dwjc_img_list_result = arr
    },
    DEL_IMG_TO_MBTQ: (state, img) => {
      state.mbtq_img_list.splice(index, 1)
    },
    DEL_IMG_TO_BHJC1: (state, img) => {
      state.bhjc_img_list1.splice(index, 1)
    },
    DEL_IMG_TO_BHJC2: (state, img) => {
      state.bhjc_img_list2.splice(index, 1)
    },
    DEL_IMG_TO_BHJC_ALL: (state) => {
      Vue.set(state, 'bhjc_img_list', [])
      Vue.set(state, 'bhjc_img_list_result', [])
    },
    DEL_IMG_TO_MBTQ_ALL: (state) => {
      Vue.set(state, 'mbtq_img_list', [])
      Vue.set(state, 'mbtq_img_list_result', [])
    },
    DEL_IMG_TO_MBJC_ALL: (state) => {
      Vue.set(state, 'mbjc_img_list', [])
      Vue.set(state, 'mbjc_img_list_result', [])
    },
    DEL_IMG_TO_DWJC_ALL: (state) => {
      Vue.set(state, 'dwjc_img_list', [])
      Vue.set(state, 'dwjc_img_list_result', [])
    },
    DEL_IMG_TO_MBJC: (state, img) => {
      state.mbjc_img_list.splice(index, 1)
    },
    DEL_IMG_TO_DWJC: (state, img) => {
      state.dwjc_img_list.splice(index, 1)
    },
    SET_IMG_TO_MBTQ_RESULT_INDEX: (state, obj) => {
      console.log('图片')
      console.log(obj)
      Vue.set(state.mbtq_img_list_result, obj.index, obj.url)
    },
    SET_IMG_TO_MBJC_RESULT_INDEX: (state, obj) => {
      Vue.set(state.mbjc_img_list_result, obj.index, obj.url)
    },
    SET_IMG_TO_BHJC_RESULT_INDEX: (state, obj) => {
      Vue.set(state.bhjc_img_list_result, obj.index, obj.url)
    },
    SET_IMG_TO_DWJC_RESULT_INDEX: (state, obj) => {
      Vue.set(state.dwjc_img_list_result, obj.index, obj.url)
    }
  },
  actions: {
    set_mbtq_all_run({ commit }) {
      commit('SET_MBTQ_ALL_RUN')
    },
    set_mbjc_all_run({ commit }) {
      commit('SET_MBJC_ALL_RUN')
    },
    set_bhjc_all_run({ commit }) {
      commit('SET_BHJC_ALL_RUN')
    },
    set_dwjc_all_run({ commit }) {
      commit('SET_DWJC_ALL_RUN')
    },
    set_img_to_mbtq({ commit }, img) {
      commit('SET_IMG_TO_MBTQ', img)
    },
    set_img_to_bhjc({ commit }, img) {
      console.log("成功")
      commit('SET_IMG_TO_BHJC', img)
    },
    set_img_to_bhjc2({ commit }, obj) {
      commit('SET_IMG_TO_BHJC2', obj)
    },
    set_img_to_mbjc({ commit }, img) {
      commit('SET_IMG_TO_MBJC', img)
    },
    set_img_to_dwjc({ commit }, img) {
      commit('SET_IMG_TO_DWJC', img)
    },
    set_img_to_mbtq_result({ commit }, img) {
      commit('SET_IMG_TO_MBTQ_RESULT', img)
    },
    set_img_to_mbtq_result_all({ commit }, obj) {
      commit('SET_IMG_TO_MBTQ_RESULT_ALL', obj)
    },
    set_img_to_bhjc_result({ commit }, img) {
      commit('SET_IMG_TO_BHJC_RESULT', img)
    },
    set_img_to_bhjc_result_all({ commit }, obj) {
      commit('SET_IMG_TO_BHJC_RESULT_ALL', obj)
    },
    set_img_to_mbjc_result({ commit }, img) {
      commit('SET_IMG_TO_MBJC_RESULT', img)
    },
    set_img_to_mbjc_result_all({ commit }, obj) {
      commit('SET_IMG_TO_MBJC_RESULT_ALL', obj)
    },
    set_img_to_dwjc_result({ commit }, img) {
      commit('SET_IMG_TO_DWJC_RESULT', img)
    },
    set_img_to_dwjc_result_all({ commit }, obj) {
      commit('SET_IMG_TO_DWJC_RESULT_ALL', obj)
    },
    del_img_to_mbtq({ commit }, index) {
      commit('DEL_IMG_TO_MBTQ', index)
    },
    del_img_to_bhjc({ commit }, index) {
      commit('DEL_IMG_TO_BHJC', index)
    },
    del_img_to_mbtq_all({ commit }) {
      commit('DEL_IMG_TO_MBTQ_ALL')
    },
    del_img_to_bhjc_all({ commit }) {
      commit('DEL_IMG_TO_BHJC_ALL')
    },
    del_img_to_mbjc_all({ commit }) {
      commit('DEL_IMG_TO_MBJC_ALL')
    },
    del_img_to_dwjc_all({ commit }) {
      commit('DEL_IMG_TO_DWJC_ALL')
    },
    del_img_to_mbjc({ commit }, index) {
      commit('DEL_IMG_TO_MBJC', index)
    },
    del_img_to_dwjc({ commit }, index) {
      commit('DEL_IMG_TO_DWJC', index)
    },
    set_img_to_mbtq_result_index({ commit }, obj) {
      commit('SET_IMG_TO_MBTQ_RESULT_INDEX', obj)
    },
    set_img_to_mbjc_result_index({ commit }, index, img) {
      commit('SET_IMG_TO_MBJC_RESULT_INDEX', index, img)
    },
    set_img_to_bhjc_result_index({ commit }, index, img) {
      commit('SET_IMG_TO_BHJC_RESULT_INDEX', index, img)
    },
    set_img_to_dwjc_result_index({ commit }, obj) {
      commit('SET_IMG_TO_DWJC_RESULT_INDEX', obj)
    }
  }
}

export default img
