<template>
    <div class="ui card">
        <div class="content">
            <div class="meta text-uppercase" style="margin-bottom: 10px;">{{ proxy.method }}</div>
            <div class="header">{{ proxy.name }}</div>
            <div class="description">
                {{ proxy.url }}
            </div>
            <div class="right aligned" style="margin-top: 10px;">
                {{ proxy.queries.length }} Request Quer{{ proxy.queries.length > 1 ? 'ies' : 'y' }}
            </div>
        </div>
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