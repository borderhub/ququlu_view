import Vue from 'vue';
import Vuex from 'vuex';
import appModule from '@/model/store/modules/app-module';
import userModule from '@/model/store/modules/user-module';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
    plugins: [createPersistedState({
        key: 'lgc',
        paths: ['userModule.userId', 'userModule.userName', 'userModule.type', 'userModule.apiToken', 'userModule.csrfHeaderName', 'userModule.csrfToken', 'userModule.tokenExpire', 'userModule.authToken'],
        storage: window.sessionStorage
    })]
});
