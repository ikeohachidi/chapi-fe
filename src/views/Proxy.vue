<template>
    <section>
        <b-container>
            <b-row>
                <b-col cols="8" class="mx-auto">
                    <div class="d-flex justify-content-end align-items-center">
                        <p>https://chapihq{{ proxy.chapiURL }}</p>
                    </div>
                    <h6 class="fw-bold">{{ proxy.name }}</h6>
                    <div class="d-flex align-items-center">
                        <p class="mb-0 me-2">Destination URL</p>
                        <!-- <sui-input placeholder="https://" v-model="proxy.url"/> -->
                    </div>
                    <div class="d-flex align-items-center">
                        <p class="mb-0 me-2">HTTP Method</p>
                        <!-- <sui-dropdown
                            :options="HTTPMethodOptions"
                            placeholder="Method"
                            search
                            selection
                            v-model="proxy.method"
                        /> -->
                    </div>
                    <table class="ui celled striped table">
                        <thead>
                            <tr>
                                <th colspan="3">URL Queries</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="collapsing">Name</td>
                                <td>Value</td>
                                <td class="right aligned collapsing">action</td>
                            </tr>
                            <tr v-for="(query, queryIndex) in proxy.queries" :key="queryIndex">
                                <td>
                                    <div class="ui input">
                                        <input type="text" placeholder="Search..." v-model="query.name">
                                    </div>
                                </td>
                                <td>
                                    <div class="ui input">
                                        <input type="text" placeholder="Search..." v-model="query.value">
                                    </div>
                                </td>
                                <td>
                                    <button class="ui primary button" @click="updateQuery(query)">Update</button>
                                    <button class="ui icon button"><i class="trash icon"></i></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </b-col>
            </b-row>
        </b-container>
    </section>
</template>

<script lang='ts'>
import {Vue, Component} from 'vue-property-decorator';

import ProxyClass, { Query } from '@/types/Proxy'
import { HTTPMethod } from '@/types/HTTP';

@Component
export default class Proxy extends Vue {
    private proxy: ProxyClass = new ProxyClass;
    private _proxyCheck: ProxyClass = new ProxyClass;

    get HTTPMethodOptions(): Record<string, string>[] {
        return Object.keys(HTTPMethod).map(key => {
            return { text: key, value: key }
        })
    }

    get projectId(): string {
        return this.$route.query['project'] as string;
    }

    get proxyId(): string {
        return this.$route.query['proxy'] as string;
    }
    
    private updateQuery(query: Query): void {
        this.$store.dispatch('proxy/updateQuery', query)
    }

    private deleteQuery(query: Query): void {
        this.$store.dispatch('proxy/deleteQuery', query)
            .then(() => {
                console.log('oh')
            })
            .catch((error) => {
                console.log(error)
            })
    }

    mounted(): void {
        const projectsProxies = this.$store.state.proxy.projectProxies;

        if (this.projectId in projectsProxies) {
            const proxies = projectsProxies[this.projectId] as ProxyClass[];

            for (const proxy of proxies) {
                if (proxy.id === this.proxyId) {
                    this.proxy = proxy;
                    this._proxyCheck = JSON.parse(JSON.stringify(proxy));


                    break;
                }
            }
        }
    }
}
</script>

<style scoped>
</style>