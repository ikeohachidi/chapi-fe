<template>
    <section class="ui container">
        <div class="ui grid">
            <div class="column ten wide centered">
                <p>https://chapihq{{ proxy.chapiURL }}</p>
                <h6>{{ proxy.name }}</h6>

                <p class="margin-b-0 text-size-1">Destination URL</p>
                <div class="ui left action input fluid">
                    <select class="ui compact selection dropdown">
                        <option 
                            v-for="methodOption in HTTPMethodOptions" 
                            :key="methodOption"
                            :value="methodOption" 
                            :selected="proxy.method.toLowerCase() === methodOption.toLowerCase()"
                        >
                            {{ methodOption }}
                        </option>
                    </select>
                    <input type="text" v-model="proxy.url">
                </div>

                <table class="ui celled striped table">
                    <thead>
                        <tr>
                            <th colspan="3">Queries</th>
                        </tr>
                        <tr>
                            <th>Name</th>
                            <th>Value</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(query, queryIndex) in proxy.queries" :key="queryIndex">
                            <td>
                                <div class="ui input">
                                    <input type="text" v-model="query.name">
                                </div>
                            </td>
                            <td>
                                <div class="ui input">
                                    <input type="text" v-model="query.value">
                                </div>
                            </td>
                            <td>
                                <button class="ui primary button" @click="updateQuery(query)">Update</button>
                                <button class="ui icon button" @click="deleteQuery(query)"><i class="trash icon"></i></button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </section>
</template>

<script lang='ts'>
import {Vue, Component} from 'vue-property-decorator';

import ProxyClass, { ProjectProxyQuery, Query } from '@/types/Proxy'
import { HTTPMethod } from '@/types/HTTP';

@Component
export default class Proxy extends Vue {
    private proxy: ProxyClass = new ProxyClass;
    private _proxyCheck: ProxyClass = new ProxyClass;

    get HTTPMethodOptions(): string[] {
        return Object.keys(HTTPMethod)
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
        const requestObject: ProjectProxyQuery = {
            projectId: this.projectId,
            proxyId: this.proxyId,
            query
        }

        this.$store.dispatch('proxy/deleteQuery', requestObject)
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