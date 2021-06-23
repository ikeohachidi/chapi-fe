<template>
    <section class="py-2 border-b border-gray-200">
        <div class="flex flex-row justify-between px-5">
            <router-link to="/" v-slot="{ navigate }" custom>
                <span @click="navigate">Chapi</span>
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
                    <li @click="navigate" @keypress.enter="navigate" class="cursor-pointer">{{ route.text }}</li>
                </router-link>
            </ul>
        </div>
    </section>
</template>

<script lang='ts'>
import {Vue, Component} from 'vue-property-decorator';

import { Route } from '@/types/Route';

@Component
export default class Navbar extends Vue {
    private routes: Route[] = [
        { link: '/dashboard', text: 'Dashboard' },
        { link: '/signin', text: 'Sign in' },
    ]
}
</script>

<style lang="scss" scoped>
ul {
    display: flex;
    margin-bottom: 0;
    list-style-type: none;
}
</style>