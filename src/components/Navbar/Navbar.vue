<template>
    <section class="py-2">
        <b-container>
            <b-row>
                <b-col cols="12" class="d-flex align-items-center justify-content-between">
                    <router-link to="/" tag="span">
                        Chapi
                    </router-link>

                    <ul>
                        <router-link 
                            v-for="route in routes" 
                            :key="route.link"
                            :to="route.link"
                            class="px-3"
                            custom
                            v-slot="{ navigate }"
                        >
                            <li @click="navigate" @keypress.enter="navigate">{{ route.text }}</li>
                        </router-link>
                    </ul>
                </b-col>
            </b-row>
        </b-container>
    </section>
</template>

<script lang='ts'>
import {Vue, Component} from 'vue-property-decorator';

import { Route } from '@/types/Route';

@Component
export default class Navbar extends Vue {
    private routes: Route[] = [
        { link: 'dashboard', text: 'Dashboard' },
        { link: 'signin', text: 'Sign in' },
    ]
}
</script>

<style lang="scss" scoped>
section {
    border-bottom: 1px solid var(--border-color);
}

ul {
    display: flex;
    margin-bottom: 0;
    list-style-type: none;
}
</style>