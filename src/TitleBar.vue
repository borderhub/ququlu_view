<template>
  <v-app-bar
    dense
    d-flex
    order-xs5
    pa-2
    color="white"
    class="sticky-scroll"
    v-bind:style="{ top : innerYOffset + 'px' }"
  >
    <v-toolbar-items>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="headline">
            <v-btn
              icon
              raised
              rounded
              @click="homeBtn">ERP
            </v-btn>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-toolbar-items>
    <template>
      <v-spacer />
      <v-menu bottom left :offset-y="true">
        <template v-slot:activator="{ on }">
          <v-chip class="mt-2" v-on="on" outlined>
            <v-icon color="grey lighten-1">person</v-icon>
            hoge
          </v-chip>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, i) in menu"
            :key="i"
            @click="onChangeContents(item)"
          >
            <v-list-item-content>
              <v-list-item-title class="body-2">
                {{ item.TITLE }}
              </v-list-item-title>
              <v-divider class="mt-2 mb-0" v-if="i===0 && menu.length > 1"></v-divider>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-app-bar-nav-icon @click.stop="onClickIsAside"></v-app-bar-nav-icon>
    </template>
  </v-app-bar>
</template>

<script lang="ts">
  import {Component, Emit, Vue, Watch} from 'vue-property-decorator';
  import {QueryInterface} from '@/model/interfaces/query-interface';
  import appModule from './model/store/modules/app-module';
  import userModule from './model/store/modules/user-module';
  import contentsModule from './model/store/modules/contents-module';
  import userService from '@/model/services/user-service';
  import {GlobalConstants} from '@/common/constants';
  import {GlobalAuthority, AuthorityNum} from '@/common/authority';
  import _ from 'lodash';

  @Component({
    components: {}
  })
  export default class TitleBar extends Vue {

    /** Computed **/
    get userName() {
      return userModule.userName;
    }

    get userId() {
      return userModule.userId;
    }

    get innerYOffset() {
      return contentsModule.innerYOffset;
    }

    get menu() {
      const menu = _.filter(GlobalConstants.MENU,
                  (item: { TITLE: string, ROUTE: string, ADMIN: boolean }) =>
                  !item.ADMIN || item.ADMIN && this.isAuthorityNumber < this.Learner );
      return GlobalConstants.MENU;
    }

    get isAuthorityNumber() {
      return userService.isAuthorityNumber(userModule.type);
    }

    get Learner() {
      return AuthorityNum.Learner;
    }

    /** Methods **/
    private async homeBtn() {
      const token: string = this.$route.query.token as string ?? userModule.apiToken as string;
      const path: string = `/dist`;
      window.location.href = `${path}?token=${token}`;
    }

    private onChangeContents(item: { TITLE: string, ROUTE: string }): void {
      const token: string = this.$route.query.token as string ?? userModule.authToken as string;
      let path = '';
      switch (item.ROUTE) {
        case 'calender':
          path = `/dist/calender`;
          break;
        case 'sharemap':
          path = `/dist/sharemap`;
          break;
        default: break;
      }
      if (this.$route.path !== path) {
        const query: QueryInterface = {
          token: `${token}`
        };
        this.$router.push({ path: `${path}`, query });
      }
    }

    private onClickIsAside() {
      contentsModule.pushIsAside(!contentsModule.isAside);
    }

    /** Watchers **/

    // エラーの伝搬
    @Emit('error')
    private errorPropagation(err: Error): Error {
      console.log(err);
      return err;
    }

    /** LifeCycle **/
    private async mounted() {
      // 初期queryのtokenをセット
      const token = this.$route.query.token ?? userModule.authToken;
      appModule.initApp({ token: `${token}` });
      const query: QueryInterface = {
        token: `${token}`
      };
      this.$router.push({path: `${this.$route.path}`,
        query
      }).catch(err => err);
      // userService.requestUserInfo();
    }

  }
</script>

<style lang="scss">
.sticky-scroll {
  position: relative;
  z-index: 2;
  .v-responsive__content {
    cursor: pointer;
  }
}
.header_select_list {
  padding: 5px 15px 5px 15px;
}
@media only screen and (max-width: 959px) {
  .v-app-bar__content, .v-app-bar__extension {
    padding: 0 2px;
  }
}
</style>
