// const getters = {
//   deployUploadApi: state => state.api.deployUploadApi,
//   databaseUploadApi: state => state.api.databaseUploadApi,
//   size: state => state.app.size,
//   sidebar: state => state.app.sidebar,
//   device: state => state.app.device,
//   token: state => state.user.token,
//   visitedViews: state => state.tagsView.visitedViews,
//   cachedViews: state => state.tagsView.cachedViews,
//   roles: state => state.user.roles,
//   user: state => state.user.user,
//   loadMenus: state => state.user.loadMenus,
//   permission_routers: state => state.permission.routers,
//   addRouters: state => state.permission.addRouters,
//   imagesUploadApi: state => state.api.imagesUploadApi,
//   baseApi: state => state.api.baseApi,
//   fileUploadApi: state => state.api.fileUploadApi,
//   updateAvatarApi: state => state.api.updateAvatarApi,
//   qiNiuUploadApi: state => state.api.qiNiuUploadApi,
//   sqlApi: state => state.api.sqlApi,
//   swaggerApi: state => state.api.swaggerApi,
//   sidebarRouters: state => state.permission.sidebarRouters
// }
// export default getters

const getters = {
  size: state => state.app.size,
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  addRouters: state => state.permission.addRouters,
  sidebarRouters: state => state.permission.sidebarRouters,
  deployUploadApi: state => state.api.deployUploadApi,
  databaseUploadApi: state => state.api.databaseUploadApi,
  token: state => state.user.token,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  roles: state => state.user.roles,
  user: state => state.user.user,
  loadMenus: state => state.user.loadMenus,
  socketApi: state => state.api.socketApi,
  imagesUploadApi: state => state.api.imagesUploadApi,
  baseApi: state => state.api.baseApi,
  fileUploadApi: state => state.api.fileUploadApi,
  fileModelUploadApi: state => state.api.fileModelUploadApi,
  updateAvatarApi: state => state.api.updateAvatarApi,
  qiNiuUploadApi: state => state.api.qiNiuUploadApi,
  sqlApi: state => state.api.sqlApi,
  swaggerApi: state => state.api.swaggerApi,
  // 获取当前的路由路径
  nowRouterPath: state => state.main.nowRouterPath,
  mbtq_img_list: state => {
    return state.img.mbtq_img_list
  },
  bhjc_img_list: state => state.img.bhjc_img_list,
  mbjc_img_list: state => state.img.mbjc_img_list,
  dwjc_img_list: state => state.img.dwjc_img_list,
  stat_pv: state => state.main.stat_pv,
  mbtq_img_list_result: state => state.img.mbtq_img_list_result,
  bhjc_img_list_result: state => state.img.bhjc_img_list_result,
  mbjc_img_list_result: state => state.img.mbjc_img_list_result,
  dwjc_img_list_result: state => state.img.dwjc_img_list_result,
  mbjc_all_run: state => state.img.mbjc_all_run,
  mbtq_all_run: state => state.img.mbtq_all_run,
  bhjc_all_run: state => state.img.bhjc_all_run,
  dwjc_all_run: state => state.img.dwjc_all_run,
  loading_img_path: state => state.main.loadingImgPath,
}

export default getters
