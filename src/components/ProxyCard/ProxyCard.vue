<template>
    <div class="rounded-md bg-white border border-gray-200 p-4 hover:shadow-sm duration-75 relative">
        <p class="uppercase text-gray-400 absolute top-0 left-0 bg-gray-300 py-1 px-3 rounded-br-sm">{{ proxy.type }}</p>
        <div class="flex items-center mt-8">
            <span class="w-7 inline-block text-gray-500">
                <i class="ri-link"></i>
            </span>
            <p class="text-gray-900">{{ proxyProject.name }}.{{ siteURL }}{{ proxy.path }}</p>
        </div>
        <div class="flex items-center mt-3">
            <span class="w-7 inline-block text-gray-500">
                <i class="ri-focus-3-line"></i>
            </span>
            <p class="text-gray-900">{{ proxy.destination }}</p>
        </div>
    </div>
</template>

<script lang='ts'>
import {Vue, Component, Prop} from 'vue-property-decorator';

import Proxy from '@/types/Proxy';
import Project from '@/types/Project';
import { getProjectById } from '@/store/modules/project';

@Component
export default class ProxyCard extends Vue {
    @Prop({ default: () => { return new Proxy }}) proxy!: Proxy;

    get siteURL(): string {
        return process.env.VUE_APP_SITE_URL
    }

    get proxyProject(): Project {
        if (!this.proxy.id) {
            return new Project();
        }

        return getProjectById(this.$store)(this.proxy.id) as Project
    }
}
</script>

<style scoped>
section {
    border: 2px solid #e6e6e6;
    background-color: #fff;
}
</style>