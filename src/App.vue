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

import { fetchAuthUser } from '@/store/modules/user';

@Component({
  components: {
    Navbar,
    AppFooter
  }
})
export default class App extends Vue {
  created(): void {
    fetchAuthUser(this.$store); 
  }
}
</script>