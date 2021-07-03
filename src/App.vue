<template>
  <div id="app">
    <navbar/>
    <router-view/>
    <app-footer/>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

import Navbar from '@/components/Navbar/Navbar.vue';
import AppFooter from '@/components/Footer/Footer.vue';

@Component({
  components: {
    Navbar,
    AppFooter
  }
})
export default class App extends Vue {

}
</script>