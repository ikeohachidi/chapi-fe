<template>
    <section class="py-2 border-b border-gray-200">
        <div class="flex flex-row justify-between px-5">
            <span @click="navigate('/')" class="flex items-center">Chapi</span>

            <ul>
                <template v-if="user">
                    <li 
                        v-for="route in routes" 
                        :key="route.text" 
                        @click="navigate(route.link)" 
                        class="px-3 cursor-pointer flex items-center"
                    >
                        {{ route.text }}
                    </li>
                    <li><button @click="logoutUser">Sign out</button></li>
                </template>
                <li v-else @click="navigate('/signin')">
                    Sign in
                </li>
            </ul>
        </div>
    </section>
</template>

<script lang='ts'>
import {Vue, Component} from 'vue-property-decorator';

import { Route } from '@/types/Route';

import { authenticatedUser, logoutUser } from '@/store/modules/user';
import User from '@/types/User';

@Component
export default class Navbar extends Vue {
    private routes: Route[] = [
        { link: '/dashboard', text: 'Dashboard' },
    ]

    get user(): User | null {
        return authenticatedUser(this.$store)
    }

    private logoutUser() {
        logoutUser(this.$store)
            .then(() => {
                this.navigate('/')
            })
    }

    private navigate(path: string) {
        if (!this.$route.path.includes(path)) {
            this.$router.push(path)
        }
    }
}
</script>

<style lang="scss" scoped>
ul {
    display: flex;
    margin-bottom: 0;
    list-style-type: none;
}
</style>