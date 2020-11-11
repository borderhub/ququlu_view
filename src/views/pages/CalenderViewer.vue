<template>
  <calender />
</template>

<script lang="ts">
// @ is an alias to /src
import {Mutation} from 'vuex-module-decorators';
import {Component, Emit, Vue, Watch} from 'vue-property-decorator';
import Calender from '@/components/organisms/Calender.vue';

@Component({
  components: {
    'calender': Calender
  }
})
export default class CalenderViewer extends Vue {

}

</script>
