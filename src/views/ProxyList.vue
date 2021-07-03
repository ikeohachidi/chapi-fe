<template>
    <section class="px-5 py-5 grid grid-cols-3 grid-rows-3 gap-5 min-h-full">
        <modal
            title="New Proxy"
            description="Please fill in a name for the new proxy"
            actionButtonText="Create Proxy"
            v-if="showNewProxyModal"
            @close="showNewProxyModal = false"
            @action="createNewProxy"
        >
            <input type="text" placeholder="chapi.com external api's" class="w-full" v-model="newProxy.name">
            <textarea rows="8" class="mt-5 resize-none w-full" v-model="newProxy.description" placeholder="Proxy Description"></textarea>
        </modal>
        <div class="w-full rounded-lg border-dashed border-4 flex items-center justify-center" @click="showNewProxyModal = true">
            <div class="transform scale-150 text-gray-400">
                <span class="gg-math-plus"></span>
            </div>
        </div>
        <ProxyCard 
            v-for="(proxy, proxyIndex) in projectProxies"
            :key="proxyIndex"
            :proxy="proxy"
            @click.native="goToProxy(proxy)"
        />
    </section>
</template>

<script lang='ts'>
import {Vue, Component, Watch} from 'vue-property-decorator';

import ProxyCard from '@/components/ProxyCard/ProxyCard.vue';
import Modal from '@/components/Modal/Modal.vue';

import Proxy from '@/types/Proxy';
import { createProxy, fetchProjectProxies } from '@/store/modules/proxy';

@Component({
    components: {
        ProxyCard,
        Modal
    }
})
export default class ProxyList extends Vue {
    private newProxy: Proxy = new Proxy; 
    private showNewProxyModal = false;

    get projectId(): number {
        return Number(this.$route.query['project']);
    }
    @Watch('projectId')
    onProjectIdChange() {
        this.getProjectProxies();
    }

    get projectProxies(): Proxy[] {
        const projectProxies = this.$store.state.proxy.projectProxies;

        if (this.projectId in projectProxies) {
            return projectProxies[this.projectId]
        }

        return []
    }

    private createNewProxy() {
        this.newProxy.projectId = this.projectId;

        createProxy(this.$store, this.newProxy)
    }

    private goToProxy(proxy: Proxy): void {
        this.$router.push({
            name: 'Proxy' ,
            query: {
                project: String(this.projectId),
                proxy: proxy ? String(proxy.id) : ''
            }
        })
    }

    private getProjectProxies(): void {
        fetchProjectProxies(this.$store, this.projectId)
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