<template>
  <div id="app">
    <navbar/>
    <router-view/>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

import Navbar from '@/components/Navbar/Navbar.vue';

@Component({
  components: {
    Navbar
  }
})
export default class App extends Vue {

}
</script>