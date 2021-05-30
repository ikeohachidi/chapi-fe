<template>
    <div class="rounded-md bg-white border border-gray-200 p-4 hover:shadow-sm duration-75">
        <p class="uppercase text-gray-400">{{ proxy.method}}</p>
        <p class="text-lg font-bold text-gray-800">{{ proxy.name }}</p>
        <p class="text-sm">{{ proxy.description }}</p>

        <p class="text-gray-400 mt-8">
            {{ proxy.queries.length }} Request Quer{{ proxy.queries.length > 1 ? 'ies' : 'y' }}
        </p>
    </div>
</template>

<script lang='ts'>
import {Vue, Component, Prop} from 'vue-property-decorator';
import Proxy from '@/types/Proxy';

@Component
export default class ProxyCard extends Vue {
    @Prop({ default: () => { return new Proxy }}) proxy!: Proxy;
}
</script>

<style scoped>
section {
    border: 2px solid #e6e6e6;
    background-color: #fff;
}
</style>