<template>
  <v-container class="pa-0" fluid full-height v-resize="onResize">
    <title-bar />
    <router-view @error="errorPropagation"></router-view>
  </v-container>
</template>

<script lang="ts">
// @ is an alias to /src
import {Component, Emit, Vue, Watch} from 'vue-property-decorator';
import TitleBar from '@/TitleBar.vue';
import _ from 'lodash';

@Component({
  components: {
    'title-bar': TitleBar
  }
})
export default class MainViewer extends Vue {
  private isPC = false;
  private isMobile = false;
  private scrollWait = 300;

  private onResize() {
    if (window.innerWidth < 1000 && !this.isPC) {
      this.isPC = true;
      this.isMobile = false;
    } else if (window.innerWidth > 1000 && !this.isMobile) {
      this.isMobile = true;
      this.isPC = false;
    }
  }

  // エラーの伝搬
  @Emit('error')
  private errorPropagation(err: Error): Error {
    console.log(err);
    return err;
  }

}

</script>
