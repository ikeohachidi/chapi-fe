<template>
    <section style="padding-top: 120px; min-height: 100%;">
        <div class="container">
            <div class="row">
                <div class="col-9 mx-auto text-center">
                    <h1 class="fw-bold" style="font-size: 36px; color: var(--text-color-primary)">
                        Sign in to Chapi
                    </h1>
                    <p class="mt-3" style="font-size: 24px; color: var(--text-color-secondary)">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Gravida augue ultricies varius 
                    </p>
                    <a href="/auth/github" class="special mt-3">
                        <img src="static/images/github.svg" alt="github icon" class="mr-2" style="height: 21px">
                        Sign in with Github
                    </a>
                </div>
            </div>
        </div>
    </section>
</template>

<script lang='ts'>
import {Vue, Component} from 'vue-property-decorator';

@Component
export default class className extends Vue {

}
</script>