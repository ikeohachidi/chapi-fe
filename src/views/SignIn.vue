<template>
    <section style="padding-top: 120px; min-height: 100%;">
        <div class="container">
            <div class="row">
                <div class="col-9 mx-auto text-center">
                    <h1 class="text-3xl font-bold mb-5">
                        Sign in to Chapi
                    </h1>
                    <p class="flex justify-center">
                        <span @click="gitubAuth" class="flex items-center text-white bg-black py-3 px-4 rounded-full">
                            <img src="@/assets/github icon.svg" alt="github icon" class="mr-2" style="height: 19px">
                            Sign in with Github
                        </span>
                    </p>
                </div>
            </div>
        </div>
    </section>
</template>

<script lang='ts'>
import {Vue, Component} from 'vue-property-decorator';

const API = process.env.VUE_APP_SERVER;

@Component
export default class className extends Vue {
    private gitubAuth() {
        window.location.href = API + '/auth/github'
    }
}
</script>