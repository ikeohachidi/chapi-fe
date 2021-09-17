<template>
    <section class="bg-black bg-opacity-80 fixed flex justify-end top-0 left-0 w-screen h-screen z-10">
        <div class="h-full bg-white w-2/5 flex flex-col">
            <p class="flex items-center py-5 px-4 bg-gray-100">
                <span class="text-gray-400 cursor-pointer" @click="close">
                    <i class="ri-close-line"></i>
                </span>
                <span class="ml-6">Proxy Response</span>
            </p>
            <div class="font-mono px-4 py-5 text-sm overflow-y-auto flex-grow" :class="[configResult.type ? 'text-green-600' : 'text-red-600']">
                <p v-if="configResult">{{ configResult.data }}</p>
            </div>
        </div>
    </section>
</template>

<script lang='ts'>
import {Vue, Component, Prop} from 'vue-property-decorator';

import { ProxyConfigResult } from '@/types/HTTP';

@Component
export default class className extends Vue {
    @Prop({ default: null }) configResult!: ProxyConfigResult;

    private close() {
        this.$emit('close')
    }
}
</script>