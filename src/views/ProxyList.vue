<template>
    <section class="main ui container">
        <template v-if="projectProxies">
            <div class="ui grid">
                <div 
                    v-for="(proxy, proxyIndex) in projectProxies"
                    :key="proxyIndex"
                    class="column four wide"
                >
                    <proxy-card :proxy="proxy" @click.native="onProxyCardClick(proxy)"/>
                </div>
            </div>
        </template>
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

    private onProxyCardClick(proxy: Proxy): void {
        this.$router.push({
            name: 'Proxy' ,
            query: {
                project: this.projectId,
                proxy: proxy.id
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

<style scoped>
.main {
    margin: 0 10px !important;
}
</style>