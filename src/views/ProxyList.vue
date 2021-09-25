<template>
    <section class="px-5 py-5 grid grid-cols-3 grid-rows-4 gap-5 min-h-full">
        <modal
            title="New Proxy"
            description="Please fill in a name for the new proxy"
            actionButtonText="Create Proxy"
            v-if="showNewProxyModal"
            @close="showNewProxyModal = false"
            @action="createNewProxy"
        >
            <input type="text" placeholder="chapi.com external api's" class="w-full" v-model="path">
            <textarea rows="8" class="mt-5 resize-none w-full" v-model="description" placeholder="Proxy Description"></textarea>
        </modal>
        <div class="w-full rounded-lg border-dashed border-4 flex items-center justify-center" @click="showNewProxyModal = true">
            <div class="transform scale-150 text-gray-400">
                <i class="ri-add-line"></i>
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

import Proxy, { CreateProxyRequest } from '@/types/Proxy';
import { createProxy, fetchProjectProxies, projectProxies } from '@/store/modules/proxy';

@Component({
    components: {
        ProxyCard,
        Modal
    }
})
export default class ProxyList extends Vue {
    private path = '';
    private description = '' ;
    private showNewProxyModal = false;

    get projectId(): number {
        return Number(this.$route.query['project']);
    }
    @Watch('projectId')
    onProjectIdChange(): void {
        if (!(this.projectId in projectProxies(this.$store))) {
            this.getProjectProxies();
        }
    }

    get projectProxies(): Proxy[] {
        const proxies = projectProxies(this.$store);

        if (this.projectId in proxies) {
            return proxies[this.projectId]
        }

        return []
    }

    private createNewProxy() {
        const proxy: CreateProxyRequest = {
            projectId: this.projectId,
            path: this.path,
            description: this.description
        }

        createProxy(this.$store, proxy)
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