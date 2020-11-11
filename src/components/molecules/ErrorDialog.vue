<template>
  <v-dialog v-model="display"
            persistent
            max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">{{text.error}}</span>
      </v-card-title>
      <v-card-text>{{ message }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error"
               text
               @click="onPushEnterBtn">OK
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import appModule from '@/model/store/modules/app-module';
  import userModule from '@/model/store/modules/user-module';
  import contentsModule from '@/model/store/modules/contents-module';
  import {GlobalConstants} from '@/common/constants';
  import {QueryInterface} from '@/model/interfaces/query-interface';
  import _ from 'lodash';

  @Component
  export default class ErrorDialog extends Vue {
    /** Data **/
    private display: boolean = false;
    private message: string = '';
    private status: number | null = null;

    get text() {
      return {
        error: GlobalConstants.TEXT.ERROR
      };
    }

    /** Methods **/
    public open(
      param: {
        state: boolean,
        message?: string,
        status?: number
      }
    ): void {
      this.message = param.message ?? '';
      this.display = param.state;
      this.status = param.status ?? null;

      if (param.status === 404) {
        const token = this.$route.query.token ?? userModule.apiToken;
        const path = ``;
        this.$router.push({
          path: `/${path}`,
          query: {
            token: `${token}`
          }
        }).catch(err => err);
      }

    }

    public close(): void {
      this.display = false;
    }

    private onPushEnterBtn({}): void {
      this.close();
      const func = _.debounce(() => {
        if (this.status === 0 || this.status === null) {
          const param = {
            state: false
          };
          appModule.updateIsError(param);
          const token = this.$route.query.token ?? userModule.apiToken;
          const query: QueryInterface = {
            token: `${token}`
          };
          this.$router.push({path: `/`,
            query
          });
        }
      }, 500);
      func();
    }

  }
</script>

<style lang="scss" scoped>

</style>
