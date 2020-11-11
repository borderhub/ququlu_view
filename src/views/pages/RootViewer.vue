<template>
  <v-container
    class="main"
    fluid
    fill-height
    flat
  >
    <v-row fluid full-height align-content="center" justify="center" class="pa-0 ma-0">
      <v-col>
        <v-card
          class="pa-2 ma-2"
        >
          <v-card-title>
            ログイン
          </v-card-title>
          <loginForm />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
  import {Mutation} from 'vuex-module-decorators';
  import {Component, Emit, Vue, Watch} from 'vue-property-decorator';
  import userModule from '@/model/store/modules/user-module';
  import appModule from '@/model/store/modules/app-module';
  import viewerService from '@/model/services/viewer-service';
  import userService from '@/model/services/user-service';
  import {UserDataOnSessionStorageDataInterface, UserDataOnSessionStorageInterface} from '@/model/interfaces/user-interface';
  import LoginForm from '@/components/organisms/LoginForm.vue';
  import _ from 'lodash';

  @Component({
    components: {
      'loginForm': LoginForm
    }
  })
  export default class RootViewer extends Vue {
    /** Data **/
    /** Computed **/
    /** Watch **/
    /** Methods **/
    // エラーの伝搬
    @Emit('error')
    private errorPropagation(err: Error): Error {
      console.log(err);
      return err;
    }

    /** LifeCycle **/
    private async mounted() {
    }

  }
</script>

<style lang="scss" scoped>
</style>
