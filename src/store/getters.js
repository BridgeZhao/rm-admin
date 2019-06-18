const getters = {
  sidebar: state => state.app.sidebar,
  lang: state => state.app.lang,
  device: state => state.app.device,
  storeId: state => state.app.storeId,
  token: state => state.user.token,
  menus: state => state.user.menus,
  storeList: state => state.app.storeList,
  name: state => state.user.name
}
export default getters
