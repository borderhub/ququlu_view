<template>
  <v-app id="app">
    <v-content>
      <main-viewer @error="errorCapture"/>
    </v-content>
    <!-- Dialogs -->
    <error-dialog ref="errorDialog"/>
    <loading-dialog
      ref="loadingDialog"
    />
  </v-app>
</template>

<script lang="ts">

  import {Component, Vue, Watch} from 'vue-property-decorator';
  import LoadingDialog from '@/components/molecules/LoadingDialog.vue';
  import ErrorDialog from '@/components/molecules/ErrorDialog.vue';
  import appModule from '@/model/store/modules/app-module';
  import MainViewer from '@/views/MainViewer.vue';

  @Component({
    components: {
      'loading-dialog': LoadingDialog,
      'error-dialog': ErrorDialog,
      'main-viewer': MainViewer
    }
  })
  export default class App extends Vue {
    /** Refs **/
    public $refs!: {
      loadingDialog: LoadingDialog,
      errorDialog: ErrorDialog
    };

    /** Computed **/
    get isLoading() {
      return appModule.isLoading;
    }

    get isError() {
      return appModule.isError;
    }
    /** Watchers **/
    @Watch('isError')
    private onIsError(): void {
      this.$refs.errorDialog.open({
        state: appModule.isError.state,
        message: appModule.isError.message,
        status: appModule.isError.status
      });
    }

    /** Methods **/
    /**
     * 子コンポーネントから伝搬してきたErrorを使ってエラーダイアログの表示
     *
     * @param err {Error}
     */
    private errorCapture(err: Error): void {
      this.$refs.errorDialog.open({
        state: true,
        message: err.message
      });
    }

  }
</script>

<style>
/* import vuetify css */
@import url("//fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900|Material+Icons");
@import url("//cdn.jsdelivr.net/npm/vuetify/dist/vuetify.min.css");
/* import material design icons css*/
@import url("//cdn.materialdesignicons.com/3.6.95/css/materialdesignicons.min.css");
@import url("//api.mapbox.com/mapbox-gl-js/v1.4.1/mapbox-gl.css");

body {
  padding: 0;
  margin: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
