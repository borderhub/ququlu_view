<!-- ログインフォーム -->
<template>
  <v-form
    ref="form"
    :lazy-validation="lazy"
  >
    <v-text-field
      :value="name"
      :counter="10"
      label="Name"
      required
      @input="onName"
      @blur="onBlur"
      :rules="[rules.required]"
      prepend-icon="person"
    ></v-text-field>
    <v-text-field
      :value="password"
      label="Password"
      required
      @input="onPassword"
      @blur="onBlur"
      :rules="[rules.required]"
      prepend-icon="lock"
    ></v-text-field>
    <v-btn
      class="mr-4"
      @click="submit"
    >
      Login
    </v-btn>
    <v-btn @click="clear">
      clear
    </v-btn>
  </v-form>
</template>
<!-- カレンダー -->

<script lang="ts">
  import {Component, Emit, Vue, Watch} from 'vue-property-decorator';
  import {HTMLElementEvent} from '@/model/interfaces/extends-interface';
  import _ from 'lodash';

  @Component({
    components: {
    }
  })
  export default class LoginForm extends Vue {
    /** Data **/
    private lazy: boolean = true;
    private name: string = '';
    private password: string = '';
    private rules = {
      required: (value: string) => !!value || '必須です',
    };
    /** Computed **/
    /** Watch **/
    /** Methods **/
    private async onName(val: string) {
      await this.$nextTick();
      (this.$refs.form as Vue & { validate: () => boolean }).validate();
      this.name = val;
    }

    private async onPassword(val: string) {
      await this.$nextTick();
      (this.$refs.form as Vue & { validate: () => boolean }).validate();
      this.password = val;
    }

    private async onBlur(ev: Event) {
      await this.$nextTick();
      (this.$refs.form as Vue & { validate: () => boolean }).validate();
    }

    private async submit() {
      await this.$nextTick();
      (this.$refs.form as Vue & { validate: () => boolean }).validate();
    }

    private async clear() {
      await this.$nextTick();
      this.name = '';
      this.password = '';
    }
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
