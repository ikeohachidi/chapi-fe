<template>
    <section class="px-5 grid grid-cols-3 gap-5 min-h-full">
        <div class="w-full rounded-lg border-dashed border-4 flex items-center justify-center h-36" @click="goToProxy">
            <div class="transform scale-150 text-gray-400">
                <span class="gg-math-plus"></span>
            </div>
        </div>
        <ProxyCard 
            class="h-36"
            v-for="(proxy, proxyIndex) in projectProxies"
            :key="proxyIndex"
            :proxy="proxy"
            @click.native="goToProxy(proxy)"
        />
    </section>
</template>

<script lang='ts'>
import {Vue, Component} from 'vue-property-decorator';

import ProxyCard from '@/components/ProxyCard/ProxyCard.vue';

import Proxy from '@/types/Proxy';

@Component({
    components: {
        ProxyCard
    }
})
export default class ProxyList extends Vue {
    get projectId(): string {
        return this.$route.query['project'] as string;
    }

    get projectProxies(): Proxy[] {
        const projectProxies = this.$store.state.proxy.projectProxies;

        if (this.projectId in projectProxies) {
            return projectProxies[this.projectId]
        }

        return []
    }

    private goToProxy(proxy: Proxy): void {
        this.$router.push({
            name: 'Proxy' ,
            query: {
                project: this.projectId,
                proxy: proxy ? proxy.id : ''
            }
        })
    }

    private getProjectProxies(): void {
        this.$store.dispatch('proxy/fetchProjectProxies', this.projectId)
            .catch(error => {
                window.console.log(error)
            })
    }

    mounted(): void {
        if (this.projectProxies.length === 0) {
            this.getProjectProxies()
        }
    }
}
</script>