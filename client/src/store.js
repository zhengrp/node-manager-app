import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const types = {
  SET_AUTH: "SET_AUTH",
  SET_USER:"SET_USER"
}
const state = {
  isAuthenticated:false,
  user:{}
}
const getters = {
  isAuthenticated: state => state.isAuthenticated,
  user:state => state.user
}
const mutations = {
  [types.SET_AUTH](state,isAuthenticated){
    if(isAuthenticated){
      state.isAuthenticated = isAuthenticated
    }else{
      state.isAuthenticated = false
    }
  },
  [types.SET_USER](state,user){
    if (user) {
      state.user = user
    } else {
      state.user = {}
    }
  }
}
const actions = {
  setAuthenticated: ({commit},isAuthenticated) => {
    commit(types.SET_AUTH,isAuthenticated)
  },
  setUser:({commit},user) => {
    commit(types.SET_USER,user)
  }
}
export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
