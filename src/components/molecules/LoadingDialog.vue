<template>
  <v-overlay v-if="isLoading" :opacity="0.46">
    <v-dialog v-model="isLoading"
              hide-overlay
              width="300">
      <v-card class="secondary">
        <v-flex>
            <v-card-text>
              <v-layout justify-center>
                <v-progress-circular indeterminate
                                     color="white"
                                     :size="50"></v-progress-circular>

              </v-layout>
              <v-layout justify-center>
                <div class="white--text mt-3">{{text.loading}}</div>
              </v-layout>
            </v-card-text>
        </v-flex>
      </v-card>
    </v-dialog>
  </v-overlay>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import {GlobalConstants} from '@/common/constants';
  import appModule from '@/model/store/modules/app-module';

  @Component
  export default class LoadingDialog extends Vue {
    /** Props **/

    get text() {
      return {
        loading: GlobalConstants.TEXT.LOADING
      };
    }

    set isLoading(val: boolean) {}

    get isLoading() {
      return appModule.isLoading;
    }
  }
</script>
